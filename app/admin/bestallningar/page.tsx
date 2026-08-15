import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Beställningar" eyebrow="Order read model" description="Sök orders utan att duplicera Pretix affärslogik för betalning och refunds." actions={["Sök order", "Resync order", "Koppla lastbil", "Öppna i Pretix"]} />;
}
