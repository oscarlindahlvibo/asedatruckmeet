import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Event" eyebrow="Multi-event" description="Skapa Åseda Truckmeet 2027, 2028 och kommande år utan hårdkodade datum." actions={["Eventläge", "Datum och plats", "Startsida", "Countdown", "Arkiv"]} />;
}
