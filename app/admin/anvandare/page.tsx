import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Användare" eyebrow="RBAC" description="Roller med least privilege och MFA-ready adminauth." actions={["Roller", "Inbjudningar", "Misstänkta login", "Samtycken"]} />;
}
