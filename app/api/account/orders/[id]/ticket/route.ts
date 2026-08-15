import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PretixClient } from "@/lib/pretix";
import { getPretixRuntimeConfig } from "@/lib/pretix-config";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Logga in krävs" }, { status: 401 });
  const { id } = await context.params;
  const link = await prisma.userOrderLink.findFirst({ where: { userId: user.id, orderId: id }, include: { order: true } });
  if (!link) return NextResponse.json({ error: "Order saknas" }, { status: 404 });
  if (!["paid", "pending"].includes(link.order.status)) return NextResponse.json({ error: "Biljetten är inte tillgänglig för nedladdning" }, { status: 409 });
  const config = await getPretixRuntimeConfig();
  if (!config) return NextResponse.json({ error: "Pretix är inte konfigurerat" }, { status: 503 });
  const response = await new PretixClient(config).downloadOrderTickets(link.order.pretixEventSlug, link.order.code);
  if (!response.ok) return NextResponse.json({ error: response.status === 409 ? "Biljetten skapas fortfarande. Försök igen om en stund." : "Pretix kunde inte skapa biljetten." }, { status: response.status === 409 ? 503 : response.status });
  return new NextResponse(await response.arrayBuffer(), { status: 200, headers: { "Content-Type": response.headers.get("content-type") ?? "application/pdf", "Content-Disposition": `attachment; filename="aseda-truckmeet-${link.order.code}.pdf"`, "Cache-Control": "private, no-store" } });
}
