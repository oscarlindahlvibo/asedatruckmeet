import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Nyheter" eyebrow="CMS" description="Nyheter med text, media, SEO, publiceringsdatum och social preview." actions={["Utkast", "Publicera", "SEO", "OG-bild"]} />;
}
