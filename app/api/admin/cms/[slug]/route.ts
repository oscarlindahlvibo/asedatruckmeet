import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-auth";

const cmsSchema = z.object({
  eventId: z.string().cuid().optional(),
  title: z.string().trim().min(2).max(160),
  intro: z.string().max(1000).nullable().optional(),
  sections: z.array(z.object({ title: z.string().trim().min(1).max(120), text: z.string().trim().min(1).max(5000) })).min(1).max(50),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(300).nullable().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const { slug } = await context.params;
  const page = await prisma.cmsPage.findFirst({ where: { slug }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ page });
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const { slug } = await context.params;
  const parsed = cmsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Kontrollera CMS-innehållet.", issues: parsed.error.flatten() }, { status: 400 });
  const { eventId, sections, status, ...fields } = parsed.data;
  const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : await prisma.event.findFirst({ orderBy: { year: "desc" } });
  if (!event) return NextResponse.json({ error: "Event saknas." }, { status: 400 });
  const before = await prisma.cmsPage.findUnique({ where: { eventId_slug: { eventId: event.id, slug } } });
  const page = await prisma.cmsPage.upsert({
    where: { eventId_slug: { eventId: event.id, slug } },
    update: { ...fields, body: { sections }, status, publishedAt: status === "PUBLISHED" ? new Date() : null },
    create: { ...fields, slug, eventId: event.id, body: { sections }, status, publishedAt: status === "PUBLISHED" ? new Date() : null },
  });
  await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "cms.updated", objectType: "CmsPage", objectId: page.id, oldValue: before ? JSON.parse(JSON.stringify(before)) : undefined, newValue: JSON.parse(JSON.stringify(page)) } });
  return NextResponse.json({ page });
}
