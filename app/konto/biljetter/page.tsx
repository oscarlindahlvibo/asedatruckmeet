import { PublicShell } from "@/components/public-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountTicketsPage() {
  const user = await getCurrentUser().catch(() => null);
  const links = user ? await prisma.userOrderLink.findMany({ where: { userId: user.id }, include: { order: { include: { positions: true, event: true } } } }).catch(() => []) : [];
  const tickets = links.flatMap(({ order }) => order.positions.map((position) => ({ ...position, eventName: order.event.name, code: order.code, status: order.status })));
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Pretix</p><h1>Mina biljetter</h1><p>Biljettdata hämtas från Pretix-read model efter verifierad orderkoppling.</p></section>{!user && <section className="fallback-box">Logga in för att se dina biljetter.</section>}{user && !tickets.length && <section className="fallback-box">Inga synkade biljetter ännu.</section>}{tickets.length > 0 && <section className="info-grid">{links.map(({ order }) => <article key={order.id}><p className="overline">{order.event.name}</p><h2>{order.code}</h2><p>{order.positions.length} biljettpositioner · {order.status}</p><a className="btn btn-primary" href={`/api/account/orders/${order.id}/ticket`}>Ladda ner biljett-PDF</a></article>)}</section>}</main></PublicShell>;
}
