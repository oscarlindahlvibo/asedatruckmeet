import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Program" eyebrow="Liveprogram" description="Skapa programpunkter och ändra tider/scen/status utan deploy." actions={["Nu/Nästa", "Försening", "Ställ in", "Byt scen", "Artistkoppling"]} />;
}
