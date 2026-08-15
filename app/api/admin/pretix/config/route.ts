import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminRole } from "@/lib/admin-auth";
import { getPretixPublicSettings, savePretixSettings } from "@/lib/pretix-config";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  baseUrl: z.string().url(),
  organizer: z.string().trim().min(1).max(80),
  eventSlug: z.string().trim().min(1).max(120),
  publicEventUrl: z.string().url(),
  apiToken: z.string().trim().optional(),
});

export async function GET() {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "TICKET_ADMIN"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "UNAUTHENTICATED" ? 401 : 403 });
  return NextResponse.json(await getPretixPublicSettings());
}

export async function PUT(request: Request) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "TICKET_ADMIN"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "UNAUTHENTICATED" ? 401 : 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Kontrollera fälten och URL:erna." }, { status: 400 });
  try {
    const saved = await savePretixSettings(parsed.data);
    await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "pretix.settings.updated", objectType: "PretixSettings", objectId: saved.id, newValue: { baseUrl: saved.baseUrl, organizer: saved.organizer, eventSlug: saved.eventSlug, publicEventUrl: saved.publicEventUrl, tokenConfigured: true } } });
    return NextResponse.json(await getPretixPublicSettings());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kunde inte spara Pretix-konfigurationen." }, { status: 500 });
  }
}
