import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Utställare" eyebrow="Kommersiella utställare" description="Hantera företag, erbjudanden, monterplatser och kartkopplingar." actions={["Skapa utställare", "Kategorier", "Monter", "Erbjudanden"]} />;
}
