import { PublicShell } from "@/components/public-shell";
import { trucks } from "@/lib/demo-data";

export default function GalleryYearPage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Album</p><h1>DEMO Galleri</h1></section><section className="truck-grid">{trucks.slice(0,9).map((truck) => <figure className="gallery-card" key={truck.slug}><img src={truck.mainImageUrl} alt="" /><figcaption>DEMO Foto: Åseda Truckmeet</figcaption></figure>)}</section></main></PublicShell>;
}
