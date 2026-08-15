import { PublicShell } from "@/components/public-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountTicketsPage() {
  const user = await getCurrentUser().catch(() => null);
  const links = user ? await prisma.userOrderLink.findMany({ where: { userId: user.id }, include: { order: { include: { positions: true, event: true } } } }).catch(() => []) : [];
  const tickets = links.flatMap(({ order }) => order.positions.map((position) => ({ ...position, eventName: order.event.name, code: order.code, status: order.status })));
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Pretix</p><h1>Mina biljetter</h1><p>Biljettdata hämtas från Pretix-read model efter verifierad orderkoppling.</p></section>{!user && <section className="fallback-box">Logga in för att se dina biljetter.</section>}{user && !tickets.length && <section className="fallback-box">Inga synkade biljetter ännu.</section>}{tickets.length > 0 && <section className="info-grid">{tickets.map((ticket) => <article key={ticket.id}><p className="overline">{ticket.eventName}</p><h2>{ticket.itemName ?? "Biljett"}</h2><p>Order {ticket.code}</p><p>{ticket.status} · {ticket.checkinState ?? "Ej incheckad"}</p></article>)}</section>}</main></PublicShell>;
}
