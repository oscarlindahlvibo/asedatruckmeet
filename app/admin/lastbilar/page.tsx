import { AdminSectionPage } from "@/components/admin-section-page";
import Link from "next/link";

export default function Page() {
  return <section className="admin-page"><p className="overline">Moderering och sekretariat</p><h1>Lastbilar</h1><p className="admin-lead">Granska profiler, tilldela trucknummer och skapa utskriftsunderlag inför insläpp och placering.</p><div className="admin-action-grid"><Link href="/api/admin/trucks/labels" target="_blank"><strong>Lappar till rutan</strong><span>Godkända lastbilar med nummer, QR och fordonsinfo. Öppna och skriv ut som PDF.</span></Link><Link href="/api/admin/trucks/export"><strong>Deltagarlista CSV</strong><span>Komplett intern lista för sekretariatet och funktionärer.</span></Link></div><AdminSectionPage title="Moderering" eyebrow="Truckprofiler" description="Väntande profiler, publicering, trucknummer, placering och QR-koder." actions={["Väntar på granskning", "Godkända profiler", "Trucknummer", "Placering", "QR-koder"]} /></section>;
}
