import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { getPublicPartnerContent } from "@/lib/public-partners";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const { tiers: partnerTiers, partners } = await getPublicPartnerContent();
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero"><p className="overline">Partnersystem</p><h1>Partners</h1><p>Fem nivåer, ett gemensamt Truckmeet. Varje sponsor har egen logotypyta, presentation, länk och möjlighet till monter på området.</p></section>
        <section className="partner-levels">{partnerTiers.map((tier) => <section className={`partner-level partner-level-${tier.rank}`} key={tier.slug}><div className="section-title"><p className="overline">Nivå {tier.rank}</p><h2>{tier.name}</h2></div><div className="partner-grid">{partners.filter((partner) => partner.tier === tier.name).map((partner) => <Link href={`/partners/${partner.slug}`} key={partner.slug}>{partner.logoUrl ? <img className="sponsor-logo-image" src={partner.logoUrl} alt={`${partner.name} logotyp`} /> : <span className="sponsor-logo" aria-hidden="true">{partner.initials}</span>}<span>{tier.name}</span><strong>{partner.name}</strong><p>{partner.description}</p></Link>)}</div></section>)}</section>
      </main>
    </PublicShell>
  );
}
