import { PublicShell } from "@/components/public-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TruckProfileForm } from "@/components/truck-profile-form";

export default async function AccountTrucksPage() {
  const user = await getCurrentUser().catch(() => null);
  const profile = user ? await prisma.truckProfile.findFirst({ where: { ownerUserId: user.id }, orderBy: { updatedAt: "desc" } }).catch(() => null) : null;
  return (
    <PublicShell>
      <main className="subpage">
        <section className="subpage-hero"><p className="overline">Din lastbil är anmäld</p><h1>Komplettera din profil</h1><p>När Pretix-order innehåller kvalificerad fordonsbiljett skapas en lastbilsprofil som ägaren kan komplettera.</p></section>
        {!user && <section className="fallback-box">Logga in på Mina sidor för att se din truckprofil.</section>}
        {user && !profile && <section className="fallback-box">Ingen kvalificerad fordonsbiljett är kopplad till ditt konto ännu.</section>}
        {profile && <TruckProfileForm profile={profile} />}
      </main>
    </PublicShell>
  );
}
