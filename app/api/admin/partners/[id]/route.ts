import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-auth";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  description: z.string().max(5000).nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
  tierId: z.string().cuid().nullable().optional(),
  logoAssetId: z.string().cuid().nullable().optional(),
  booth: z.string().max(120).nullable().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  isPublic: z.boolean().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const { id } = await context.params;
  const before = await prisma.partner.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Sponsor saknas." }, { status: 404 });
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Kontrollera sponsoruppgifterna." }, { status: 400 });
  const partner = await prisma.partner.update({ where: { id }, data: parsed.data });
  await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "partner.updated", objectType: "Partner", objectId: id, oldValue: JSON.parse(JSON.stringify(before)), newValue: JSON.parse(JSON.stringify(partner)) } });
  return NextResponse.json({ partner });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const { id } = await context.params;
  const before = await prisma.partner.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Sponsor saknas." }, { status: 404 });
  await prisma.partner.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "partner.deleted", objectType: "Partner", objectId: id, oldValue: JSON.parse(JSON.stringify(before)) } });
  return NextResponse.json({ ok: true });
}
