"use client";

import { FormEvent, useState } from "react";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setPreviewUrl("");
    const response = await fetch("/api/auth/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setMessage(data.error ?? "Något gick fel.");
    setMessage("Länken är skapad. Kontrollera din e-post.");
    if (data.previewUrl) setPreviewUrl(data.previewUrl);
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="account-email">E-postadress</label>
      <div className="auth-form-row">
        <input id="account-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@exempel.se" required />
        <button className="button button-primary" disabled={busy}>{busy ? "Skickar..." : "Skicka magic link"}</button>
      </div>
      {message && <p className="form-note">{message}</p>}
      {previewUrl && <a className="text-link" href={previewUrl}>Öppna förhandslänk i lokal miljö</a>}
    </form>
  );
}
