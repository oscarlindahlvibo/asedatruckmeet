import { adminMetrics, currentEvent } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  return (
    <section className="admin-page">
      <p className="overline">Dashboard</p>
      <h1>{currentEvent.name}</h1>
      <div className="admin-metric-grid">
        {adminMetrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.source}</small>
          </article>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Live sekretariat</h2>
        <p>Dashboarden är byggd för stor skärm under eventet: check-in/minut, sålda idag, fordon på plats, röster, webbtrafik och integrationsfel.</p>
      </div>
    </section>
  );
}
