import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function csv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "TRUCK_MODERATOR", "STAFF_READONLY"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "UNAUTHENTICATED" ? 401 : 403 });
  const eventId = new URL(request.url).searchParams.get("eventId");
  const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : await prisma.event.findFirst({ orderBy: { year: "desc" } });
  if (!event) return NextResponse.json({ error: "Event saknas" }, { status: 404 });
  const trucks = await prisma.truckProfile.findMany({ where: { eventId: event.id }, orderBy: [{ area: "asc" }, { row: "asc" }, { truckNumber: "asc" }] });
  const headers = ["trucknummer", "status", "åkeri", "förare", "registreringsnummer", "land", "ort", "märke", "modell", "årsmodell", "motortyp", "effekt", "påbyggnad", "kategori", "tävlingsklass", "område", "rad", "plats", "Pretix-order"];
  const rows = trucks.map((truck) => [truck.truckNumber, truck.status, truck.companyName, truck.driverName, truck.registrationNumber, truck.country, truck.city, truck.brand, truck.model, truck.modelYear, truck.engineType, truck.enginePower, truck.bodywork, truck.category, truck.competitionClass, truck.area, truck.row, truck.placeNumber, truck.pretixOrderCode].map(csv).join(";"));
  return new NextResponse([headers.map(csv).join(";"), ...rows].join("\r\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="aseda-truckmeet-${event.year}-deltagarlista.csv"` } });
}
