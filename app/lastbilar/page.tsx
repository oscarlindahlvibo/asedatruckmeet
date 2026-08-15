import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { trucks } from "@/lib/demo-data";

const filters = ["Scania", "Volvo", "Mercedes-Benz", "MAN", "DAF", "Iveco", "veteran", "showtruck", "specialtransport"];

export default function TrucksPage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Publikt galleri</p>
          <h1>Lastbilar</h1>
          <p>Godkända publika truckprofiler från aktuellt event. Demo-data är tydligt markerad tills Pretix och användarprofiler är kopplade.</p>
          <div className="filter-row">
            {filters.map((filter) => <button key={filter}>{filter}</button>)}
          </div>
        </section>
        <section className="truck-grid">
          {trucks.filter((truck) => truck.status === "APPROVED").map((truck) => (
            <Link className="truck-card" href={`/lastbilar/${truck.slug}`} key={truck.slug}>
              <img src={truck.mainImageUrl} alt={`${truck.companyName} ${truck.brand} ${truck.model}`} loading="lazy" />
              <div>
                <span>{truck.truckNumber}</span>
                <h2>{truck.brand} {truck.model}</h2>
                <p>{truck.companyName} · {truck.city}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </PublicShell>
  );
}
