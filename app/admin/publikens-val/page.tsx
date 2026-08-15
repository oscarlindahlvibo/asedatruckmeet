import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Publikens val" eyebrow="Voting" description="Skapa omröstning per event med verifieringsregler och preliminära adminresultat." actions={["Öppettider", "Röstregler", "Anti-abuse", "Preliminära resultat", "Publicera vinnare"]} />;
}
