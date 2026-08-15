import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { trucks } from "@/lib/demo-data";
import { getPublicTruckView } from "@/lib/domain-rules";

export function generateStaticParams() {
  return trucks.map((truck) => ({ slug: truck.slug }));
}

export default async function TruckProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const truck = trucks.find((item) => item.slug === slug);
  const publicTruck = truck ? getPublicTruckView(truck) : null;

  if (!truck || !publicTruck) {
    notFound();
  }

  return (
    <PublicShell>
      <main className="truck-profile">
        <section className="truck-profile-hero">
          <img src={truck.mainImageUrl} alt={`${truck.companyName} ${truck.brand} ${truck.model}`} />
          <div>
            <span>{truck.truckNumber}</span>
            <h1>{truck.companyName}</h1>
            <p>{truck.brand} {truck.model}</p>
            <small>{truck.city}, {truck.country}</small>
          </div>
        </section>
        <section className="content-band two-col">
          <div>
            <p className="overline">Tävlingsklass</p>
            <h2>{truck.competitionClass}</h2>
          </div>
          <div className="copy-stack">
            <p>{truck.description}</p>
            <dl className="spec-grid">
              <div><dt>Årsmodell</dt><dd>{truck.modelYear}</dd></div>
              <div><dt>Kategori</dt><dd>{truck.category}</dd></div>
              <div><dt>Trucknummer</dt><dd>{truck.truckNumber}</dd></div>
            </dl>
            <Link className="btn btn-primary" href={`/rosta?truck=${truck.truckNumber}`}>Rösta på denna lastbil</Link>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
