import { PublicShell } from "@/components/public-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountOrdersPage() {
  const user = await getCurrentUser().catch(() => null);
  const links = user ? await prisma.userOrderLink.findMany({ where: { userId: user.id }, include: { order: { include: { positions: true, event: true } } }, orderBy: { verifiedAt: "desc" } }).catch(() => []) : [];
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Orderkoppling</p><h1>Mina beställningar</h1><p>Beställningar visas bara om orderns verifierade e-post/orderlänk tillhör användaren.</p></section>{!user && <section className="fallback-box">Logga in för att se dina beställningar.</section>}{user && !links.length && <section className="fallback-box">Inga synkade beställningar ännu.</section>}{links.length > 0 && <section className="info-grid">{links.map(({ order }) => <article key={order.id}><p className="overline">{order.event.name}</p><h2>{order.code}</h2><p>{order.status} · {order.total ?? "-"} {order.currency ?? ""}</p><p>{order.positions.length} biljettpositioner</p></article>)}</section>}</main></PublicShell>;
}
