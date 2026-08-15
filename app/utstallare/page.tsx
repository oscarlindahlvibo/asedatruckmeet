import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { exhibitors } from "@/lib/demo-data";

export default function ExhibitorsPage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero"><p className="overline">Kommersiella utställare</p><h1>Utställare</h1><p>Utställare separeras från sponsorer och kan ha erbjudanden, karta och monterplats.</p></section>
        <section className="partner-grid">{exhibitors.map((item) => <Link href={`/utstallare/${item.slug}`} key={item.slug}><span>{item.category}</span><strong>{item.name}</strong><p>{item.description}</p></Link>)}</section>
      </main>
    </PublicShell>
  );
}
