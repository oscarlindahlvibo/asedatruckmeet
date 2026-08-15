import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Karta" eyebrow="POI och rutter" description="Ladda upp baskarta, placera POI och skapa rekommenderade gångrutter." actions={["Baskarta", "POI", "Routes", "Truckplacering", "QR-skyltar"]} />;
}
