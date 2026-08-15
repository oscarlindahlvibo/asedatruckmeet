import { PublicShell } from "@/components/public-shell";

const timeline = [
  ["2016", "Starten", "40 ekipage på en central grusplan."],
  ["2018", "Egen helg", "Truckmeet blir egen festival helgen efter midsommar."],
  ["2022", "Comeback", "Tillbaka efter inställda pandemiår."],
  ["2025", "Rekordår", "Över 160 lastbilar och slutsålda festivalkvällar."],
  ["2026", "10-årsjubileum", "Ett decennium med Truckmeet."],
  ["2027", "Nästa kapitel", "Ny eventplattform och större digital upplevelse."],
];

export default function AboutPage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Om Åseda Truckmeet</p><h1>Vår resa</h1><p>En växande folkfest i Småland, från grusplan till professionell truckfestival.</p></section><section className="timeline-list">{timeline.map(([year,title,text]) => <article key={year}><span>{year}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</section></main></PublicShell>;
}
