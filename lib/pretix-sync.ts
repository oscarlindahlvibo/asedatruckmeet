import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { PretixClient } from "@/lib/pretix";

function hashSecret(value: string | undefined) {
  return value ? createHash("sha256").update(value).digest("hex") : null;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export async function syncPretixOrder(input: { eventId: string; eventSlug: string; organizerSlug: string; code: string }) {
  const client = new PretixClient();
  const source = await client.getOrder(input.eventSlug, input.code);
  const buyerEmail = source.email?.trim().toLowerCase() ?? null;
  const buyerName = source.invoice_address?.name ?? null;
  const order = await prisma.pretixOrderReadModel.upsert({
    where: { organizerSlug_pretixEventSlug_code: { organizerSlug: input.organizerSlug, pretixEventSlug: input.eventSlug, code: source.code } },
    update: { buyerEmail, buyerName, status: source.status, total: source.total, currency: source.currency, raw: source as object, lastSyncedAt: new Date() },
    create: { eventId: input.eventId, organizerSlug: input.organizerSlug, pretixEventSlug: input.eventSlug, code: source.code, buyerEmail, buyerName, status: source.status, total: source.total, currency: source.currency, raw: source as object },
  });

  await prisma.pretixOrderPositionReadModel.deleteMany({ where: { orderId: order.id } });
  const positions = source.positions ?? [];
  await prisma.pretixOrderPositionReadModel.createMany({ data: positions.map((position) => ({ orderId: order.id, pretixPositionId: position.id, itemId: position.item, variationId: position.variation, itemName: position.item_name, admission: position.admission ?? false, secretHash: hashSecret(position.secret), checkinState: position.checkins?.length ? "CHECKED_IN" : "NOT_CHECKED_IN", raw: position as object })) });

  if (buyerEmail) {
    const user = await prisma.user.findUnique({ where: { email: buyerEmail } });
    if (user) await prisma.userOrderLink.upsert({ where: { userId_orderId: { userId: user.id, orderId: order.id } }, update: {}, create: { userId: user.id, orderId: order.id } });
  }

  const vehiclePosition = positions.find((position) => /lastbil|truck|fordon|showtruck|utställning/i.test(position.item_name ?? ""));
  if (vehiclePosition) {
    const owner = buyerEmail ? await prisma.user.findUnique({ where: { email: buyerEmail } }) : null;
    await prisma.truckProfile.upsert({
      where: { eventId_slug: { eventId: input.eventId, slug: `${slugify(source.code)}-${vehiclePosition.id}` } },
      update: { ownerUserId: owner?.id, pretixOrderCode: source.code, pretixPositionId: vehiclePosition.id },
      create: { eventId: input.eventId, ownerUserId: owner?.id, pretixOrderCode: source.code, pretixPositionId: vehiclePosition.id, slug: `${slugify(source.code)}-${vehiclePosition.id}`, status: "INCOMPLETE" },
    });
  }
  return order;
}

export async function processPretixWebhook(id: string) {
  const webhook = await prisma.pretixWebhookEvent.findUnique({ where: { id } });
  if (!webhook) return;
  if (!webhook.eventSlug || !webhook.orderCode || !webhook.organizerSlug) {
    await prisma.pretixWebhookEvent.update({ where: { id }, data: { status: "IGNORED", processedAt: new Date() } });
    return;
  }
  const event = await prisma.event.findFirst({ where: { pretixEventSlug: webhook.eventSlug } });
  if (!event) throw new Error(`Event saknas för Pretix-event ${webhook.eventSlug}`);
  await syncPretixOrder({ eventId: event.id, eventSlug: webhook.eventSlug, organizerSlug: webhook.organizerSlug, code: webhook.orderCode });
  await prisma.pretixWebhookEvent.update({ where: { id }, data: { status: "PROCESSED", processedAt: new Date(), error: null } });
}
