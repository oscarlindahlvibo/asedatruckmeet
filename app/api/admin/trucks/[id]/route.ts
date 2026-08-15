import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-auth";

const schema = z.object({ status: z.enum(["INCOMPLETE", "PENDING_APPROVAL", "APPROVED", "REJECTED", "HIDDEN"]), truckNumber: z.string().max(20).nullable().optional(), area: z.string().max(80).nullable().optional(), row: z.string().max(80).nullable().optional(), placeNumber: z.string().max(80).nullable().optional() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "TRUCK_MODERATOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const { id } = await context.params;
  const before = await prisma.truckProfile.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Truck saknas." }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Ogiltig moderering." }, { status: 400 });
  const profile = await prisma.truckProfile.update({ where: { id }, data: parsed.data });
  await prisma.auditLog.create({ data: { actorUserId: access.user.id, action: "truck.moderated", objectType: "TruckProfile", objectId: id, oldValue: JSON.parse(JSON.stringify(before)), newValue: JSON.parse(JSON.stringify(profile)) } });
  return NextResponse.json({ profile });
}
