import { AdminSectionPage } from "@/components/admin-section-page";

export default function Page() {
  return <AdminSectionPage title="Artister" eyebrow="Profiler" description="Artistprofiler med bild, bio, sociala länkar och programkoppling." actions={["Artistbild", "Bio", "Speltid", "Spotify/Instagram"]} />;
}
