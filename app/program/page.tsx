import { PublicShell } from "@/components/public-shell";
import { programItems } from "@/lib/demo-data";

export default function ProgramPage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Nu · Nästa · Senare idag</p>
          <h1>Program</h1>
          <p>Liveprogrammet kan ändras från admin utan deploy. Under eventet markeras aktuell programpunkt automatiskt.</p>
        </section>
        <section className="timeline-list">
          {programItems.map((item, index) => (
            <article className={index === 2 ? "is-live" : ""} key={item.slug}>
              <span>{index === 2 ? "LIVE NU" : item.time}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <small>{item.place} · {item.category}</small>
              </div>
            </article>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
