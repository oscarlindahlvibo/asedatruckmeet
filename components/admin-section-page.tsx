export function AdminSectionPage({
  title,
  eyebrow,
  description,
  actions,
}: {
  title: string;
  eyebrow: string;
  description: string;
  actions: string[];
}) {
  return (
    <section className="admin-page">
      <p className="overline">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="admin-lead">{description}</p>
      <div className="admin-action-grid">
        {actions.map((action) => (
          <article key={action}>
            <strong>{action}</strong>
            <span>DEMO modul redo för databasdriven implementation.</span>
          </article>
        ))}
      </div>
    </section>
  );
}
