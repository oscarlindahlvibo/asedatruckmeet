import { AdminSectionPage } from "@/components/admin-section-page";
import { AdminPretixConfig } from "@/components/admin-pretix-config";

export default function Page() {
  return <section className="admin-page"><p className="overline">Integration</p><h1>Pretix</h1><p className="admin-lead">Koppla biljettmotorn, kontrollera integrationen och hantera synkning utan att lägga hemligheter i frontend.</p><AdminPretixConfig /><AdminSectionPage title="Drift och synkning" eyebrow="Integration" description="Webhook-events, sync-jobb, produkter, quotas, check-in och integrationsfel." actions={["Webhooklogg", "Resync event", "Resync order", "Check-in lists", "Integrationsfel"]} /></section>;
}
