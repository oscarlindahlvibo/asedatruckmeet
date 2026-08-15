import Script from "next/script";
import { PublicShell } from "@/components/public-shell";
import { PretixWidget } from "@/components/pretix-widget";
import { currentEvent } from "@/lib/demo-data";
import { getTicketShopProducts } from "@/lib/ticket-shop";
import { TicketCatalog } from "@/components/ticket-catalog";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const { products, live } = await getTicketShopProducts();

  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Åseda Truckmeet · {currentEvent.year}</p>
          <h1>Biljetter</h1>
          <p>
            Välj rätt biljett för ditt besök. Produkterna och priserna hämtas
            från vår biljettmotor och checkouten slutförs säkert i Pretix.
          </p>
        </section>
        <section className="ticket-shop-status">
          <span className="ticket-status-dot" aria-hidden="true" />
          {live ? "Biljetter och tillgänglighet uppdateras live" : "Förhandsvisning av biljettbutiken"}
        </section>
        <TicketCatalog products={products} />
        <section className="ticket-widget-shell" id="pretix-checkout">
          <div className="ticket-checkout-heading">
            <div>
              <p className="overline">Säker checkout</p>
              <h2>Slutför ditt köp</h2>
            </div>
            <p>Betalning, orderbekräftelse, QR-biljett och återbetalning hanteras av Pretix.</p>
          </div>
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
