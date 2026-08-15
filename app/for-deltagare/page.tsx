import { PublicShell } from "@/components/public-shell";

const items = ["Insläppstider", "Fordonsregler", "Brandsläckare", "Camping", "El", "Placering", "Utfart", "Kontakt"];

export default function ParticipantPage() {
  return (
    <PublicShell>
      <main className="subpage info-page">
        <section className="subpage-hero"><p className="overline">För fordonsägare</p><h1>Deltagarinformation</h1><p>Samlad information för dig som kommer med lastbil.</p></section>
        <section className="info-grid">{items.map((title) => <article key={title}><h2>{title}</h2><p>DEMO Innehåll kopplat till Mina sidor och fordonsregistrering.</p></article>)}</section>
      </main>
    </PublicShell>
  );
}
