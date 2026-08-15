import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-auth";

const partnerSchema = z.object({
  eventId: z.string().cuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  tierId: z.string().cuid().nullable().optional(),
  logoAssetId: z.string().cuid().nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  booth: z.string().max(120).nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  isPublic: z.boolean().optional(),
});

export async function GET() {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const partners = await prisma.partner.findMany({ include: { tier: true, event: { select: { year: true, name: true } } }, orderBy: [{ event: { year: "desc" } }, { sortOrder: "asc" }, { name: "asc" }] });
  return NextResponse.json({ partners });
}

export async function POST(request: Request) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const parsed = partnerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Kontrollera sponsoruppgifterna.", issues: parsed.error.flatten() }, { status: 400 });
  const { eventId, ...data } = parsed.data;
  const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : await prisma.event.findFirst({ orderBy: { year: "desc" } });
  if (!event) return NextResponse.json({ error: "Event saknas." }, { status: 400 });
  const partner = await prisma.partner.create({ data: { ...data, eventId: event.id } });
  await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "partner.created", objectType: "Partner", objectId: partner.id, newValue: JSON.parse(JSON.stringify(partner)) } });
  return NextResponse.json({ partner }, { status: 201 });
}
