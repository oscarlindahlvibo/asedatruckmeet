import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export default function GalleryPage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Galleri</p><h1>Bildarkiv</h1><p>Eventbaserade album med fotograf, bildtext och lightbox.</p></section><section className="account-grid">{[2027,2026,2025].map((year) => <Link href={`/galleri/${year}`} key={year}><strong>{year}</strong><span>Öppna album</span></Link>)}</section></main></PublicShell>;
}
