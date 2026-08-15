import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Audit log" eyebrow="Security" description="Känsliga adminåtgärder loggas med aktör, objekt, tid och förändrade värden." actions={["Orders", "Votes", "Truck approvals", "Användare", "Pretix"]} />;
}
