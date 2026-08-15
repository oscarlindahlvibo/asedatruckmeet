import { PublicShell } from "@/components/public-shell";

export default function ProfilePage() {
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">Profil</p><h1>Min profil</h1><p>Kontaktuppgifter, samtycken, dataexport och radering/anonymisering där juridiskt möjligt.</p></section><section className="form-grid profile-form"><label>Namn<input /></label><label>E-post<input /></label><label>Telefon<input /></label><label className="check-row"><input type="checkbox" /> Jag vill få marknadsföring separat från köpinformation.</label></section></main></PublicShell>;
}
