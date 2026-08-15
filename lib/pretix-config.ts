import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getPretixConfig, type PretixConfig } from "@/lib/pretix";

const SETTINGS_ID = "default";

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET saknas");
  return createHash("sha256").update(secret).digest();
}

export function encryptPretixToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

function decryptPretixToken(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8");
}

export async function getPretixRuntimeConfig(): Promise<PretixConfig | null> {
  const settings = await prisma.pretixSettings.findUnique({ where: { id: SETTINGS_ID } }).catch(() => null);
  if (!settings?.encryptedApiToken) return getPretixConfig();
  try {
    return { baseUrl: settings.baseUrl, token: decryptPretixToken(settings.encryptedApiToken), organizer: settings.organizer };
  } catch {
    return null;
  }
}

export async function getPretixPublicSettings() {
  const settings = await prisma.pretixSettings.findUnique({ where: { id: SETTINGS_ID } }).catch(() => null);
  return {
    baseUrl: settings?.baseUrl ?? process.env.PRETIX_BASE_URL ?? "",
    organizer: settings?.organizer ?? process.env.PRETIX_ORGANIZER ?? "",
    eventSlug: settings?.eventSlug ?? process.env.PRETIX_EVENT_SLUG ?? "",
    publicEventUrl: settings?.publicEventUrl ?? process.env.NEXT_PUBLIC_PRETIX_EVENT_URL ?? "",
    tokenConfigured: Boolean(settings?.tokenConfigured || process.env.PRETIX_API_TOKEN),
    updatedAt: settings?.updatedAt?.toISOString() ?? null,
  };
}

export async function savePretixSettings(input: { baseUrl: string; organizer: string; eventSlug: string; publicEventUrl: string; apiToken?: string }) {
  const existing = await prisma.pretixSettings.findUnique({ where: { id: SETTINGS_ID } });
  const encryptedApiToken = input.apiToken?.trim() ? encryptPretixToken(input.apiToken.trim()) : existing?.encryptedApiToken ?? null;
  if (!encryptedApiToken) throw new Error("API-token måste anges första gången");
  return prisma.pretixSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { baseUrl: input.baseUrl, organizer: input.organizer, eventSlug: input.eventSlug, publicEventUrl: input.publicEventUrl, encryptedApiToken, tokenConfigured: true },
    create: { id: SETTINGS_ID, baseUrl: input.baseUrl, organizer: input.organizer, eventSlug: input.eventSlug, publicEventUrl: input.publicEventUrl, encryptedApiToken, tokenConfigured: true },
  });
}
