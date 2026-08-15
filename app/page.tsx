import Link from "next/link";
import { ArrowRight, Clock, MapPin, RadioTower, Sparkles } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import {
  currentEvent,
  liveStats,
  programItems,
  trucks,
} from "@/lib/demo-data";
import { getPublicPartnerContent } from "@/lib/public-partners";

export const dynamic = "force-dynamic";

function countdownTarget() {
  const now = Date.now();
  const ticketSales = new Date(currentEvent.ticketSalesOpenAt).getTime();
  const eventStart = new Date(currentEvent.startsAt).getTime();
  const target = now < ticketSales ? ticketSales : eventStart;
  const diff = Math.max(0, target - now);

  return {
    label: now < ticketSales ? "Biljettsläpp" : "Eventstart",
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
  };
}

export default async function Home() {
  const countdown = countdownTarget();
  const featuredTrucks = trucks.slice(0, 6);
  const { tiers: partnerTiers, partners } = await getPublicPartnerContent();

  return (
    <PublicShell>
      <main>
        <section className="home-hero">
          <div className="home-hero-bg">
            <img src={currentEvent.heroImageUrl} alt="" />
          </div>
          <div className="home-hero-content">
            <p className="overline">
              <Sparkles size={16} />
              {currentEvent.heroKicker}
            </p>
            <h1>{currentEvent.heroTitle}</h1>
            <p className="hero-date">{currentEvent.dateLabel}</p>
            <p className="hero-lead">{currentEvent.heroLead}</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" href="/biljetter">
                Köp biljett <ArrowRight size={18} />
              </Link>
              <Link className="btn btn-ghost" href="/konto/lastbilar">
                Anmäl lastbil
              </Link>
              <Link className="btn btn-minimal" href="/program">
                Program
              </Link>
              <Link className="btn btn-minimal" href="/besok">
                Besöksinfo
              </Link>
            </div>
          </div>
          <aside className="countdown-card" aria-label={countdown.label}>
            <span>{countdown.label}</span>
            <strong>{countdown.days}</strong>
            <small>dagar</small>
            <div>
              {String(countdown.hours).padStart(2, "0")}:
              {String(countdown.minutes).padStart(2, "0")}
            </div>
          </aside>
        </section>

        <section className="live-stat-grid" aria-label="Live statistik">
          {liveStats
            .filter((stat) => stat.enabled)
            .map((stat) => (
              <article key={stat.id}>
                <strong>{stat.value.toLocaleString("sv-SE")}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
        </section>

        <section className="content-band two-col">
          <div>
            <p className="overline">
              <RadioTower size={16} />
              Eventläge: {currentEvent.stage}
            </p>
            <h2>Mörker, krom och Smålands största truckhelg.</h2>
          </div>
          <div className="copy-stack">
            <p>
              Plattformen är byggd eventbaserat. När Åseda Truckmeet 2028 ska
              lanseras skapas ett nytt event i admin, med egna texter, program,
              partners, galleri, truckprofiler och Pretix-koppling.
            </p>
            <p>
              Under live-läge prioriteras mobilens snabbval: karta, program,
              röstning och biljetter. Det är där ute på området magin och
              mobiltäckningen har ett intressant förhållande.
            </p>
          </div>
        </section>

        <section className="cinema-section">
          <div className="section-title">
            <p className="overline">Publikt lastbilsgalleri</p>
            <h2>Showtrucks i centrum</h2>
            <Link href="/lastbilar">Se alla lastbilar</Link>
          </div>
          <div className="truck-strip">
            {featuredTrucks.map((truck) => (
              <Link className="truck-tile" href={`/lastbilar/${truck.slug}`} key={truck.slug}>
                <img src={truck.mainImageUrl} alt={`${truck.companyName} ${truck.brand}`} />
                <span>{truck.truckNumber}</span>
                <strong>{truck.brand} {truck.model}</strong>
                <small>{truck.companyName}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-band two-col">
          <div>
            <p className="overline">
              <Clock size={16} />
              Liveprogram
            </p>
            <h2>Nu, nästa och senare idag</h2>
          </div>
          <div className="program-list compact">
            {programItems.slice(0, 4).map((item) => (
              <Link href="/program" key={item.slug}>
                <span>{item.time}</span>
                <strong>{item.title}</strong>
                <small>{item.place}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="partner-showcase">
          <div className="section-title"><p className="overline">Partners som gör folkfesten möjlig</p><h2>Med Åseda Truckmeet</h2><Link href="/partners">Se alla partners</Link></div>
          <div className="sponsor-tier-grid">
            {partnerTiers.map((tier) => <div className={`sponsor-tier sponsor-tier-${tier.rank}`} key={tier.slug}><p className="overline">{tier.name}</p><div>{partners.filter((partner) => partner.tier === tier.name).slice(0, tier.rank === 1 ? 1 : 4).map((partner) => <Link className="sponsor-card" href={`/partners/${partner.slug}`} key={partner.slug}>{partner.logoUrl ? <img className="sponsor-logo-image" src={partner.logoUrl} alt={`${partner.name} logotyp`} /> : <span className="sponsor-logo" aria-hidden="true">{partner.initials}</span>}<strong>{partner.name}</strong><small>{partner.description}</small></Link>)}</div></div>)}
          </div>
        </section>

        <section className="contact-slab">
          <div>
            <p className="overline">
              <MapPin size={16} />
              Åseda Folkets Park
            </p>
            <h2>Redo för nästa kapitel?</h2>
          </div>
          <Link className="btn btn-primary" href="/biljetter">
            Säkra din plats
          </Link>
        </section>
      </main>
    </PublicShell>
  );
}
