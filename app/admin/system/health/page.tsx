import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Systemhälsa" eyebrow="Monitoring" description="Kontroller för database, Pretix API, object storage, email, queue och webhooks. API finns på /api/system/health." actions={["Database", "Pretix API", "Object storage", "Email", "Queue", "Webhooks"]} />;
}
