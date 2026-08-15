import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Biljetter" eyebrow="Pretix" description="Biljettprodukter, quotas och köpflöde hämtas från Pretix." actions={["Synka produkter", "Visa quotas", "Öppna i Pretix", "Widget-konfiguration"]} />;
}
