import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { PretixClient } from "@/lib/pretix";
import { getPretixRuntimeConfig } from "@/lib/pretix-config";
import { requestMagicLink, sendMagicLink } from "@/lib/auth";

function hashSecret(value: string | undefined) {
  return value ? createHash("sha256").update(value).digest("hex") : null;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function truckQuestionAnswers(answers: Array<{ question_identifier?: string; answer?: string }> | undefined) {
  const configured = process.env.PRETIX_TRUCK_QUESTION_MAP;
  const map = configured ? JSON.parse(configured) as Record<string, string> : {
    companyName: "truck_company",
    driverName: "truck_driver",
    registrationNumber: "truck_registration",
    country: "truck_country",
    city: "truck_city",
    brand: "truck_brand",
    model: "truck_model",
    modelYear: "truck_model_year",
    engineType: "truck_engine_type",
    enginePower: "truck_engine_power",
    vehicleHeight: "truck_vehicle_height",
    vehicleLength: "truck_vehicle_length",
    shirtSize: "truck_shirt_size",
    bodywork: "truck_bodywork",
    category: "truck_category",
    competitionClass: "truck_competition_class",
    description: "truck_description",
    instagramUrl: "truck_instagram",
    facebookUrl: "truck_facebook",
    websiteUrl: "truck_website",
    photographer: "truck_photographer",
    publicConsent: "truck_public_consent",
  };
  const byIdentifier = new Map((answers ?? []).map((answer) => [answer.question_identifier, answer.answer ?? ""]));
  const value = (field: string) => map[field] ? byIdentifier.get(map[field]) : undefined;
  const data: Record<string, string | number | boolean> = {};
  for (const field of ["companyName", "driverName", "registrationNumber", "country", "city", "brand", "model", "engineType", "enginePower", "vehicleHeight", "vehicleLength", "shirtSize", "bodywork", "category", "competitionClass", "description", "instagramUrl", "facebookUrl", "websiteUrl", "photographer"]) {
    const answer = value(field);
    if (answer) data[field] = answer;
  }
  const modelYear = value("modelYear");
  if (modelYear && Number.isInteger(Number(modelYear))) data.modelYear = Number(modelYear);
  const publicConsent = value("publicConsent");
  if (publicConsent) data.publicConsent = ["true", "1", "ja", "yes"].includes(publicConsent.toLowerCase());
  return data;
}

export async function syncPretixOrder(input: { eventId: string; eventSlug: string; organizerSlug: string; code: string; action?: string }) {
  const config = await getPretixRuntimeConfig();
  if (!config) throw new Error("Pretix saknar konfiguration");
  const client = new PretixClient(config);
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
    let user = await prisma.user.findUnique({ where: { email: buyerEmail } });
    if (!user) {
      user = await prisma.user.create({ data: { email: buyerEmail } });
      if (input.action === "pretix.event.order.placed") {
        try {
          const token = await requestMagicLink(buyerEmail);
          await sendMagicLink(buyerEmail, token);
        } catch (error) {
          await prisma.integrationError.create({ data: { source: "auth", severity: "warning", message: "Kunde inte skicka automatisk konto-inbjudan efter Pretix-order.", context: { email: buyerEmail, error: error instanceof Error ? error.message : "unknown" } } });
        }
      }
    }
    if (user) await prisma.userOrderLink.upsert({ where: { userId_orderId: { userId: user.id, orderId: order.id } }, update: {}, create: { userId: user.id, orderId: order.id } });
  }

  const vehiclePosition = positions.find((position) => /lastbil|truck|fordon|showtruck|utställning/i.test(position.item_name ?? ""));
  if (vehiclePosition) {
    const owner = buyerEmail ? await prisma.user.findUnique({ where: { email: buyerEmail } }) : null;
    const truckData = truckQuestionAnswers(vehiclePosition.answers);
    const registrationData = { answers: vehiclePosition.answers ?? [], extras: positions.filter((position) => position.id !== vehiclePosition.id).map((position) => ({ item: position.item, variation: position.variation, name: position.item_name })) };
    await prisma.truckProfile.upsert({
      where: { eventId_slug: { eventId: input.eventId, slug: `${slugify(source.code)}-${vehiclePosition.id}` } },
      update: { ownerUserId: owner?.id, pretixOrderCode: source.code, pretixPositionId: vehiclePosition.id, registrationData, ...truckData },
      create: { eventId: input.eventId, ownerUserId: owner?.id, pretixOrderCode: source.code, pretixPositionId: vehiclePosition.id, slug: `${slugify(source.code)}-${vehiclePosition.id}`, status: "INCOMPLETE", registrationData, ...truckData },
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
  await syncPretixOrder({ eventId: event.id, eventSlug: webhook.eventSlug, organizerSlug: webhook.organizerSlug, code: webhook.orderCode, action: webhook.action });
  await prisma.pretixWebhookEvent.update({ where: { id }, data: { status: "PROCESSED", processedAt: new Date(), error: null } });
}
