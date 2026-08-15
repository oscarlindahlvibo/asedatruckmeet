import { AdminPartnerManager } from "@/components/admin-partner-manager";

export default function Page() {
  return <section className="admin-page"><p className="overline">Sponsorer</p><h1>Partners</h1><p className="admin-lead">Byt ut sponsorer, publicera eller dölj dem och koppla varje partner till rätt event utan deploy.</p><AdminPartnerManager /></section>;
}
