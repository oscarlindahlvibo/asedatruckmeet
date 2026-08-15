"use client";

import { useEffect, useState } from "react";

type Settings = { baseUrl: string; organizer: string; eventSlug: string; publicEventUrl: string; tokenConfigured: boolean; updatedAt: string | null };

const initial: Settings = { baseUrl: "", organizer: "", eventSlug: "", publicEventUrl: "", tokenConfigured: false, updatedAt: null };

export function AdminPretixConfig() {
  const [settings, setSettings] = useState(initial);
  const [apiToken, setApiToken] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/pretix/config").then((response) => response.ok ? response.json() : Promise.reject()).then(setSettings).catch(() => setMessage("Kunde inte läsa konfigurationen.")); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage("");
    const response = await fetch("/api/admin/pretix/config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...settings, apiToken: apiToken || undefined }) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setMessage(data.error ?? "Kunde inte spara."); return; }
    setSettings(data); setApiToken(""); setMessage("Pretix-konfigurationen är sparad.");
  }

  return <form className="admin-form pretix-config-form" onSubmit={save}>
    <div className="admin-form-heading"><div><p className="overline">Server-side integration</p><h2>Pretix API</h2></div><span className={settings.tokenConfigured ? "config-state is-ready" : "config-state"}>{settings.tokenConfigured ? "Ansluten" : "Ej konfigurerad"}</span></div>
    <p className="admin-note">Token krypteras innan den sparas och visas aldrig igen i admin eller webbläsaren.</p>
    <div className="form-grid">
      <label>Pretix bas-URL<input required type="url" value={settings.baseUrl} onChange={(event) => setSettings({ ...settings, baseUrl: event.target.value })} placeholder="https://biljetter.example.se" /></label>
      <label>Organizer slug<input required value={settings.organizer} onChange={(event) => setSettings({ ...settings, organizer: event.target.value })} placeholder="truckmeet" /></label>
      <label>Event slug<input required value={settings.eventSlug} onChange={(event) => setSettings({ ...settings, eventSlug: event.target.value })} placeholder="2027" /></label>
      <label>Publik event-URL<input required type="url" value={settings.publicEventUrl} onChange={(event) => setSettings({ ...settings, publicEventUrl: event.target.value })} placeholder="https://biljetter.example.se/truckmeet/2027/" /></label>
      <label className="form-grid-wide">API-token<input type="password" value={apiToken} onChange={(event) => setApiToken(event.target.value)} placeholder={settings.tokenConfigured ? "Lämna tomt för att behålla nuvarande token" : "Token från Pretix"} autoComplete="new-password" /></label>
    </div>
    <div className="admin-form-actions"><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Sparar..." : "Spara konfiguration"}</button>{message && <p className="form-note">{message}</p>}</div>
  </form>;
}
