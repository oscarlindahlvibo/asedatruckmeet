import Link from "next/link";
import {
  Activity,
  Calendar,
  FileText,
  GalleryHorizontal,
  Gauge,
  Handshake,
  Map,
  Music,
  Shield,
  Ticket,
  Truck,
  Users,
  Vote,
} from "lucide-react";

const adminNav = [
  ["Översikt", "/admin", Gauge],
  ["Event", "/admin/event", Calendar],
  ["Biljetter", "/admin/biljetter", Ticket],
  ["Beställningar", "/admin/bestallningar", FileText],
  ["Lastbilar", "/admin/lastbilar", Truck],
  ["Publikens val", "/admin/publikens-val", Vote],
  ["Program", "/admin/program", Calendar],
  ["Karta", "/admin/karta", Map],
  ["Utställare", "/admin/utstallare", Users],
  ["Partners", "/admin/partners", Handshake],
  ["Artister", "/admin/artister", Music],
  ["Nyheter", "/admin/nyheter", FileText],
  ["Galleri", "/admin/galleri", GalleryHorizontal],
  ["Webbplats", "/admin/webbplats", Activity],
  ["Användare", "/admin/anvandare", Users],
  ["System", "/admin/system/health", Shield],
  ["Pretix", "/admin/pretix", Ticket],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-logo" href="/admin">
          <span>ÅT</span>
          <strong>Control</strong>
        </Link>
        <nav aria-label="Adminnavigation">
          {adminNav.map(([label, href, Icon]) => (
            <Link href={href as string} key={href as string}>
              <Icon size={17} />
              {label as string}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
