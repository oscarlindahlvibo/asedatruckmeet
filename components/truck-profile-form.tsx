"use client";

import { useState } from "react";

type Profile = { id: string; companyName: string | null; driverName: string | null; registrationNumber: string | null; publicRegistration: boolean; city: string | null; brand: string | null; model: string | null; modelYear: number | null; category: string | null; description: string | null; publicConsent: boolean };

export function TruckProfileForm({ profile }: { profile: Profile }) {
  const [data, setData] = useState({ ...profile, modelYear: profile.modelYear?.toString() ?? "" });
  const [message, setMessage] = useState("");
  const update = (key: string, value: string | boolean) => setData((current) => ({ ...current, [key]: value }));
  async function save() {
    const response = await fetch(`/api/account/trucks/${profile.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...data, modelYear: data.modelYear ? Number(data.modelYear) : null }) });
    setMessage(response.ok ? "Profilen skickades till granskning." : "Profilen kunde inte sparas.");
  }
  return <div className="truck-editor-preview"><div><h2>Komplettera din profil</h2><div className="form-grid"><label>Åkeri/företag<input value={data.companyName ?? ""} onChange={(e) => update("companyName", e.target.value)} /></label><label>Chaufför/ägare<input value={data.driverName ?? ""} onChange={(e) => update("driverName", e.target.value)} /></label><label>Registreringsnummer<input value={data.registrationNumber ?? ""} onChange={(e) => update("registrationNumber", e.target.value)} /></label><label>Ort<input value={data.city ?? ""} onChange={(e) => update("city", e.target.value)} /></label><label>Märke<input value={data.brand ?? ""} onChange={(e) => update("brand", e.target.value)} /></label><label>Modell<input value={data.model ?? ""} onChange={(e) => update("model", e.target.value)} /></label><label>Årsmodell<input type="number" value={data.modelYear} onChange={(e) => update("modelYear", e.target.value)} /></label><label>Kategori<input value={data.category ?? ""} onChange={(e) => update("category", e.target.value)} /></label><label className="wide-field">Beskrivning<textarea rows={5} value={data.description ?? ""} onChange={(e) => update("description", e.target.value)} /></label></div><label className="check-row"><input type="checkbox" checked={data.publicConsent} onChange={(e) => update("publicConsent", e.target.checked)} /> Visa min lastbil offentligt</label><button className="btn btn-primary" onClick={() => void save()}>Spara och skicka för granskning</button>{message && <p className="form-note">{message}</p>}</div></div>;
}
