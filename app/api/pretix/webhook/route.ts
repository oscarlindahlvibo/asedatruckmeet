import { NextResponse } from "next/server";
import { normalizeWebhook, type PretixWebhookPayload } from "@/lib/pretix";
import { prisma } from "@/lib/prisma";

function hasValidBasicAuth(request: Request) {
  const configuredUser = process.env.PRETIX_WEBHOOK_BASIC_USER;
  const configuredPassword = process.env.PRETIX_WEBHOOK_BASIC_PASSWORD;
  if (!configuredUser || !configuredPassword) return process.env.NODE_ENV !== "production";
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  return decoded === `${configuredUser}:${configuredPassword}`;
}

export async function POST(request: Request) {
  if (!hasValidBasicAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = (await request.json()) as PretixWebhookPayload;
  const normalized = normalizeWebhook(payload);
  const existing = await prisma.pretixWebhookEvent.findUnique({ where: { idempotencyKey: normalized.idempotencyKey } }).catch(() => null);
  if (existing) return NextResponse.json({ ok: true, accepted: true, duplicate: true, idempotencyKey: normalized.idempotencyKey }, { status: 202 });

  await prisma.pretixWebhookEvent.create({
    data: {
      idempotencyKey: normalized.idempotencyKey,
      notificationId: normalized.notificationId,
      action: normalized.action,
      organizerSlug: normalized.organizerSlug,
      eventSlug: normalized.eventSlug,
      orderCode: normalized.orderCode,
      payload: payload as object,
      status: normalized.shouldSyncOrder ? "QUEUED" : "RECEIVED",
    },
  });

  return NextResponse.json(
    {
      ok: true,
      accepted: true,
      idempotencyKey: normalized.idempotencyKey,
      action: normalized.action,
      sync: normalized.shouldSyncOrder ? "queued" : "not_required",
    },
    { status: 202 },
  );
}
