import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Galleri" eyebrow="Media" description="Album per år, fotograf, bildtext, lazy loading och praktisk bulkhantering." actions={["Album", "Bulk-upload", "Fotograf", "Lightbox"]} />;
}
