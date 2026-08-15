import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { mapPois, mapRoutes } from "@/lib/demo-data";

export default function MapPage() {
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero">
          <p className="overline">Eventkarta</p>
          <h1>Karta</h1>
          <p>Admin kan ladda upp baskarta och placera POI, truckar, sponsorer och rekommenderade rutter.</p>
        </section>
        <section className="map-shell">
          <div className="event-map">
            <svg viewBox="0 0 100 100" role="img" aria-label="Demo-karta över eventområdet">
              <path d="M12 24 C34 34,54 38,68 70 S42 62,18 70" className="route-path" />
              {mapPois.map((poi) => (
                <g key={poi.slug}>
                  <circle cx={poi.x} cy={poi.y} r="2.6" />
                  <text x={poi.x + 3} y={poi.y + 1}>{poi.name}</text>
                </g>
              ))}
            </svg>
          </div>
          <aside className="poi-list">
            <h2>Platser</h2>
            {mapPois.map((poi) => (
              <Link href={`/karta?poi=${poi.slug}`} key={poi.slug}>
                <span>{poi.category}</span>
                <strong>{poi.name}</strong>
              </Link>
            ))}
            <h2>Rutter</h2>
            {mapRoutes.map((route) => (
              <Link href={`/karta?route=${route.slug}`} key={route.slug}>{route.name}</Link>
            ))}
          </aside>
        </section>
      </main>
    </PublicShell>
  );
}
