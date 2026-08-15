import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdminRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function escapeHtml(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export async function GET(request: Request) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "TRUCK_MODERATOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "UNAUTHENTICATED" ? 401 : 403 });
  const eventId = new URL(request.url).searchParams.get("eventId");
  const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : await prisma.event.findFirst({ orderBy: { year: "desc" } });
  if (!event) return NextResponse.json({ error: "Event saknas" }, { status: 404 });
  const trucks = await prisma.truckProfile.findMany({ where: { eventId: event.id, status: "APPROVED", truckNumber: { not: null } }, orderBy: [{ area: "asc" }, { row: "asc" }, { truckNumber: "asc" }] });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://asedatruckmeet.se";
  const labels = await Promise.all(trucks.map(async (truck) => {
    const number = truck.truckNumber ?? "";
    const qr = await QRCode.toDataURL(`${siteUrl}/t/${encodeURIComponent(number)}`, { margin: 1, width: 150 });
    return `<article class="label"><div class="label-head"><div class="number">${escapeHtml(number)}</div><img src="${qr}" alt="QR ${escapeHtml(number)}"></div><h1>${escapeHtml(truck.companyName || "Utställare")}</h1><h2>${escapeHtml([truck.brand, truck.model].filter(Boolean).join(" "))}</h2><dl><div><dt>Förare</dt><dd>${escapeHtml(truck.driverName)}</dd></div><div><dt>Ort</dt><dd>${escapeHtml([truck.city, truck.country].filter(Boolean).join(", "))}</dd></div><div><dt>Placering</dt><dd>${escapeHtml([truck.area, truck.row, truck.placeNumber].filter(Boolean).join(" · ") || "Ej tilldelad")}</dd></div><div><dt>Klass</dt><dd>${escapeHtml(truck.competitionClass || truck.category)}</dd></div></dl><p class="footer">Åseda Truckmeet ${event.year} · ${escapeHtml(number)}</p></article>`;
  }));
  const html = `<!doctype html><html lang="sv"><head><meta charset="utf-8"><title>Rutor ${event.year} · Åseda Truckmeet</title><style>@page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;color:#111;font-family:Arial,sans-serif}.sheet{display:grid;grid-template-columns:1fr 1fr;gap:7mm}.label{min-height:125mm;border:2px solid #111;padding:7mm;break-inside:avoid;display:flex;flex-direction:column}.label-head{display:flex;align-items:start;justify-content:space-between;border-bottom:4px solid #f1b52f;padding-bottom:4mm}.label-head img{width:32mm;height:32mm}.number{font-size:35mm;font-weight:900;line-height:.85}.label h1{font-size:21pt;margin:7mm 0 1mm;text-transform:uppercase}.label h2{font-size:15pt;margin:0 0 7mm;color:#444}.label dl{margin:0;display:grid;gap:3mm}.label dl div{display:flex;gap:4mm;border-bottom:1px solid #ccc;padding-bottom:2mm}.label dt{width:29mm;color:#666;font-size:8pt;text-transform:uppercase;font-weight:bold}.label dd{margin:0;font-size:11pt;font-weight:bold}.footer{margin-top:auto;padding-top:5mm;font-size:8pt;color:#666}</style></head><body><main class="sheet">${labels.join("")}</main></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Disposition": `inline; filename="aseda-truckmeet-${event.year}-rutor.html"` } });
}
