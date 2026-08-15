import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { MagicLinkForm } from "@/components/magic-link-form";
import { getCurrentUser } from "@/lib/auth";

const cards = [
  ["Mina biljetter", "/konto/biljetter"],
  ["Mina beställningar", "/konto/bestallningar"],
  ["Mina lastbilar", "/konto/lastbilar"],
  ["Min profil", "/konto/profil"],
];

export default async function AccountPage() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero"><p className="overline">Mina sidor</p><h1>Konto</h1><p>{user ? `Inloggad som ${user.email}.` : "Logga in med magic link för att se biljetter, beställningar och dina lastbilar."}</p></section>
        {!user && <section className="fallback-box"><MagicLinkForm /></section>}
        <section className="account-grid">{cards.map(([label, href]) => <Link href={href} key={href}><strong>{label}</strong><span>Öppna</span></Link>)}</section>
      </main>
    </PublicShell>
  );
}
