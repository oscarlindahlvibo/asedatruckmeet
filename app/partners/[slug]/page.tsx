import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { getPublicPartner } from "@/lib/public-partners";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const partner = await getPublicPartner(slug);
  if (!partner) notFound();
  return (
    <PublicShell>
      <main className="subpage">
        <section className="partner-detail-hero">{partner.logoUrl ? <img className="sponsor-logo-image sponsor-logo-large" src={partner.logoUrl} alt={`${partner.name} logotyp`} /> : <span className="sponsor-logo sponsor-logo-large" aria-hidden="true">{partner.initials}</span>}<div><p className="overline">{partner.tier}</p><h1>{partner.name}</h1><p>{partner.description}</p></div></section>
        <section className="content-band"><p>Den här partnerprofilen är eventbaserad och kan uppdateras från admin med logotyp, text, webbplats, sociala länkar, kampanj och monterplats.</p>{partner.websiteUrl && <a className="text-link" href={partner.websiteUrl}>Besök sponsorns webbplats</a>}</section>
        <section className="content-band two-col"><h2>På området</h2><p>{partner.booth ? `Monter ${partner.booth}` : "Ingen monter kopplad ännu."}</p></section>
      </main>
    </PublicShell>
  );
}
