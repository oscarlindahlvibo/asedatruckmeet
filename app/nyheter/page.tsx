import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export default function NewsPage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Nyheter</p><h1>Nyheter</h1><p>Inbyggd CMS-funktion utan WordPress.</p></section><section className="info-grid">{[1,2,3].map((id) => <Link href={`/nyheter/demo-${id}`} key={id}><h2>DEMO Nyhet {id}</h2><p>Ingress, media, publiceringsdatum och SEO-data.</p></Link>)}</section></main></PublicShell>;
}
