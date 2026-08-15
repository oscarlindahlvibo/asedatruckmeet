import { PublicShell } from "@/components/public-shell";
import { getPublishedCmsPage, readVisitSections } from "@/lib/cms";

const sections = ["Hitta hit", "Parkering", "Entréer", "Öppettider", "Betalning", "Barn", "Camping", "Tillgänglighet", "Mat och dryck", "Alkohol", "Hundar", "Säkerhet", "Fotografering", "Regler"];

export const dynamic = "force-dynamic";

export default async function VisitPage() {
  const page = await getPublishedCmsPage("besok");
  const cmsSections = readVisitSections(page?.body);
  const intro = page?.intro ?? "All publik information är strukturerad i admin så arrangören snabbt kan uppdatera det som gäller.";
  return (
    <PublicShell>
      <main className="subpage info-page">
        <section className="subpage-hero"><p className="overline">Besöksinformation</p><h1>Besök</h1><p>{intro}</p></section>
        <section className="info-grid">{(cmsSections ?? sections.map((title) => ({ title, text: `DEMO Administrerbar information för ${title.toLowerCase()} inför Åseda Truckmeet 2027.` }))).map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.text}</p></article>)}</section>
      </main>
    </PublicShell>
  );
}
