import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Lastbilar" eyebrow="Moderering" description="Granska profiler, tilldela trucknummer, område, rad, plats och QR." actions={["Väntar på granskning", "Godkända profiler", "Trucknummer", "Placering", "QR-koder"]} />;
}
