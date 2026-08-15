import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const SESSION_COOKIE = "truckmeet_session";
const SESSION_DAYS = 30;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createOneTimeToken() {
  return randomBytes(32).toString("base64url");
}

export async function requestMagicLink(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const token = createOneTimeToken();
  await prisma.magicLinkToken.deleteMany({ where: { email: normalizedEmail } });
  await prisma.magicLinkToken.create({
    data: {
      email: normalizedEmail,
      tokenHash: hash(token),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
  return token;
}

export async function sendMagicLink(email: string, token: string) {
  if (process.env.NODE_ENV !== "production") return;
  const host = process.env.SMTP_HOST;
  const from = process.env.MAGIC_LINK_FROM;
  if (!host || !from) {
    throw new Error("SMTP is not configured");
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from,
    to: email,
    subject: "Din inloggning till Åseda Truckmeet",
    text: `Öppna länken för att logga in: ${link}\n\nLänken gäller i 15 minuter.`,
    html: `<p>Öppna länken för att logga in på Mina sidor:</p><p><a href="${link}">Logga in på Åseda Truckmeet</a></p><p>Länken gäller i 15 minuter.</p>`,
  });
}

export async function consumeMagicLink(token: string) {
  const record = await prisma.magicLinkToken.findUnique({ where: { tokenHash: hash(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;

  const user = await prisma.user.upsert({
    where: { email: record.email },
    update: { emailVerified: new Date() },
    create: { email: record.email, emailVerified: new Date() },
  });
  await prisma.magicLinkToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

  const rawSession = createOneTimeToken();
  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: hash(rawSession),
      expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  return { user, rawSession };
}

export async function setSessionCookie(rawSession: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, rawSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;
  if (!rawSession) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(rawSession) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  return session.user;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;
  if (rawSession) await prisma.session.deleteMany({ where: { tokenHash: hash(rawSession) } });
  cookieStore.delete(SESSION_COOKIE);
}
