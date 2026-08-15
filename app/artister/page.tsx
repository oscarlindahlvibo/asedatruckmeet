import { PublicShell } from "@/components/public-shell";

export default function ArtistsPage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Artister</p><h1>Artister 2027</h1><p>Artistprofiler återanvänds på startsida och i programmet.</p></section><section className="info-grid">{["DEMO Artist 1","DEMO Artist 2","DEMO Artist 3"].map((name) => <article key={name}><h2>{name}</h2><p>Bio, bild och sociala länkar från admin.</p></article>)}</section></main></PublicShell>;
}
