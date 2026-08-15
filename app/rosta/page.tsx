import { PublicShell } from "@/components/public-shell";
import { trucks } from "@/lib/demo-data";

export default function VotePage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Publikens val</p>
          <h1>Rösta</h1>
          <p>Röstningsregler styrs per event: öppettider, max antal röster, e-postverifiering eller biljettkrav.</p>
        </section>
        <section className="vote-grid">
          {trucks.slice(0, 12).map((truck) => (
            <article key={truck.truckNumber}>
              <img src={truck.mainImageUrl} alt="" />
              <strong>{truck.truckNumber} · {truck.brand} {truck.model}</strong>
              <span>{truck.companyName}</span>
              <button>Rösta</button>
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
