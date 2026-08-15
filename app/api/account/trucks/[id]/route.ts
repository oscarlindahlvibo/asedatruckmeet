import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  companyName: z.string().max(160).nullable().optional(), driverName: z.string().max(160).nullable().optional(), registrationNumber: z.string().max(30).nullable().optional(), publicRegistration: z.boolean().optional(), country: z.string().max(80).nullable().optional(), city: z.string().max(120).nullable().optional(), brand: z.string().max(80).nullable().optional(), model: z.string().max(120).nullable().optional(), modelYear: z.number().int().min(1900).max(2100).nullable().optional(), engineType: z.string().max(120).nullable().optional(), enginePower: z.string().max(80).nullable().optional(), bodywork: z.string().max(160).nullable().optional(), category: z.string().max(100).nullable().optional(), competitionClass: z.string().max(100).nullable().optional(), description: z.string().max(5000).nullable().optional(), instagramUrl: z.string().url().nullable().optional(), facebookUrl: z.string().url().nullable().optional(), websiteUrl: z.string().url().nullable().optional(), publicConsent: z.boolean(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  const { id } = await context.params;
  const before = await prisma.truckProfile.findFirst({ where: { id, ownerUserId: user.id } });
  if (!before) return NextResponse.json({ error: "Truckprofil saknas." }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Kontrollera truckprofilen.", issues: parsed.error.flatten() }, { status: 400 });
  const profile = await prisma.truckProfile.update({ where: { id }, data: { ...parsed.data, status: parsed.data.publicConsent ? "PENDING_APPROVAL" : "INCOMPLETE" } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "truck.updated", objectType: "TruckProfile", objectId: id, oldValue: JSON.parse(JSON.stringify(before)), newValue: JSON.parse(JSON.stringify(profile)) } });
  return NextResponse.json({ profile });
}
