import { PublicShell } from "@/components/public-shell";

export default async function ArchiveYearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Arkiv</p><h1>Åseda Truckmeet {year}</h1><p>Historiskt eventinnehåll: truckprofiler, vinnare, galleri, program, partners och statistik.</p></section></main></PublicShell>;
}
