import Script from "next/script";
import { PublicShell } from "@/components/public-shell";
import { PretixWidget } from "@/components/pretix-widget";
import { currentEvent } from "@/lib/demo-data";

export default function TicketsPage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Pretix ticket shop</p>
          <h1>Biljetter</h1>
          <p>
            Köpflödet körs via Pretix, men bäddas in här så besökaren stannar
            i Åseda Truckmeet-upplevelsen. Pretix är source of truth för order,
            betalning, QR, kvitto och återbetalning.
          </p>
        </section>
        <section className="ticket-widget-shell">
          <Script src={`${currentEvent.pretixEventUrl.replace(/\/$/, "")}/widget/v2.sv.js`} strategy="lazyOnload" />
          <link rel="stylesheet" href={`${currentEvent.pretixEventUrl.replace(/\/$/, "")}/widget/v2.css`} />
          <PretixWidget eventUrl={currentEvent.pretixEventUrl} />
          <noscript>
            <div className="fallback-box">
              JavaScript är avstängt. Öppna biljettbutiken direkt:
              <a href={currentEvent.pretixEventUrl}>Pretix ticket shop</a>
            </div>
          </noscript>
        </section>
      </main>
    </PublicShell>
  );
}
