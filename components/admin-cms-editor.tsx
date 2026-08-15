"use client";

import { useEffect, useState } from "react";

const fallback = ["Hitta hit|Åseda Folkets Park, Ekängsvägen 2, 577 71 Virserum.", "Parkering|Följ skyltning från infarten och använd markerade parkeringar.", "Entréer|Entré norr och entré söder öppnar enligt aktuell eventstatus.", "Öppettider|Fredag och lördag enligt programmet.", "Camping|Camping bokas separat och öppnar samtidigt som biljetterna.", "Mat och dryck|Lokala mataktörer, bar och alkoholfria alternativ finns på området.", "Tillgänglighet|Kontakta arrangören inför besöket så hjälper vi till med tillgänglig väg.", "Regler|Följ funktionärernas instruktioner och lämna området i gott skick."];

export function AdminCmsEditor() {
  const [title, setTitle] = useState("Besök Åseda Truckmeet");
  const [intro, setIntro] = useState("Praktisk information inför ditt besök.");
  const [lines, setLines] = useState(fallback.join("\n"));
  const [status, setStatus] = useState("DRAFT");
  const [message, setMessage] = useState("Laddar CMS...");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch("/api/admin/cms/besok").then(async (response) => {
        const data = await response.json();
        if (!response.ok) return setMessage("Logga in som redaktör för att ändra information.");
        if (data.page) {
          setTitle(data.page.title);
          setIntro(data.page.intro ?? "");
          setStatus(data.page.status);
          setLines((data.page.body.sections ?? []).map((section: { title: string; text: string }) => `${section.title}|${section.text}`).join("\n"));
        }
        setMessage("CMS redo att redigeras.");
      }).catch(() => setMessage("CMS kunde inte laddas."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function save() {
    const sections = lines.split("\n").map((line) => { const [sectionTitle, ...rest] = line.split("|"); return { title: sectionTitle.trim(), text: rest.join("|").trim() }; }).filter((section) => section.title && section.text);
    const response = await fetch("/api/admin/cms/besok", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, intro, status, sections }) });
    setMessage(response.ok ? "Besöksinformationen sparades." : "Kunde inte spara CMS-innehållet.");
  }

  return <div className="admin-crud"><div className="admin-form"><h2>Besöksinformation</h2><label>Rubrik<input value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>Ingress<textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} /></label><label>Sektioner<textarea value={lines} onChange={(e) => setLines(e.target.value)} rows={14} /><small>En rad per sektion: Rubrik|Text</small></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="DRAFT">Utkast</option><option value="PUBLISHED">Publicerad</option></select></label><button className="button button-primary" onClick={() => void save()}>Spara information</button></div><p className="admin-note">{message}</p></div>;
}
