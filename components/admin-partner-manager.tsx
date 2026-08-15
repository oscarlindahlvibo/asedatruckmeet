"use client";

import { FormEvent, useEffect, useState } from "react";

type Partner = { id: string; name: string; slug: string; websiteUrl: string | null; booth: string | null; isPublic: boolean; sortOrder: number; tier: { name: string } | null; event: { year: number } };

export function AdminPartnerManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [message, setMessage] = useState("Laddar sponsorer...");
  const [form, setForm] = useState({ name: "", slug: "", websiteUrl: "", tierId: "", booth: "" });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  async function load() {
    const response = await fetch("/api/admin/partners");
    const data = await response.json();
    if (!response.ok) return setMessage(data.error === "UNAUTHENTICATED" ? "Logga in som arrangör för att redigera sponsorer." : "Sponsorer kunde inte laddas.");
    setPartners(data.partners);
    setMessage(`${data.partners.length} sponsorer i databasen.`);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let logoAssetId: string | null = null;
    if (logoFile) { const upload = new FormData(); upload.set("file", logoFile); const uploadResponse = await fetch("/api/uploads/partner-logo", { method: "POST", body: upload }); const uploadData = await uploadResponse.json(); if (!uploadResponse.ok) return setMessage(uploadData.error ?? "Logotypen kunde inte laddas upp."); logoAssetId = uploadData.assetId; }
    const response = await fetch("/api/admin/partners", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, websiteUrl: form.websiteUrl || null, tierId: form.tierId || null, booth: form.booth || null, logoAssetId }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "Sponsorn kunde inte sparas.");
    setForm({ name: "", slug: "", websiteUrl: "", tierId: "", booth: "" });
    setLogoFile(null);
    setMessage("Sponsorn sparades.");
    await load();
  }

  async function toggle(partner: Partner) {
    await fetch(`/api/admin/partners/${partner.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ isPublic: !partner.isPublic }) });
    await load();
  }

  async function remove(partner: Partner) {
    if (!window.confirm(`Ta bort ${partner.name}?`)) return;
    await fetch(`/api/admin/partners/${partner.id}`, { method: "DELETE" });
    await load();
  }

  return <div className="admin-crud">
    <form className="admin-form" onSubmit={create}>
      <h2>Lägg till sponsor</h2>
      <div className="form-grid">
        <label>Namn<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="foretagsnamn" required /></label>
        <label>Nivå-ID<input value={form.tierId} onChange={(e) => setForm({ ...form, tierId: e.target.value })} placeholder="Valfritt" /></label>
        <label>Webbplats<input type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://" /></label>
        <label>Monter<input value={form.booth} onChange={(e) => setForm({ ...form, booth: e.target.value })} /></label>
        <label>Logotyp<input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} /></label>
      </div>
      <button className="button button-primary" type="submit">Spara sponsor</button>
    </form>
    <p className="admin-note">{message}</p>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Sponsor</th><th>Nivå</th><th>Event</th><th>Status</th><th>Åtgärd</th></tr></thead><tbody>{partners.map((partner) => <tr key={partner.id}><td><strong>{partner.name}</strong><small>{partner.slug}</small></td><td>{partner.tier?.name ?? "Ej vald"}</td><td>{partner.event.year}</td><td>{partner.isPublic ? "Publik" : "Dold"}</td><td><button className="button button-small" onClick={() => void toggle(partner)}>{partner.isPublic ? "Dölj" : "Publicera"}</button><button className="button button-small button-danger" onClick={() => void remove(partner)}>Ta bort</button></td></tr>)}</tbody></table></div>
  </div>;
}
