import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Pretix" eyebrow="Integration" description="Webhook-events, sync-jobb, produkter, quotas, check-in och integrationsfel." actions={["Webhooklogg", "Resync event", "Resync order", "Check-in lists", "Integrationsfel"]} />;
}
