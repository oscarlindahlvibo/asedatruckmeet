import Link from "next/link";
import { CalendarDays, Map, Menu, Ticket, Trophy, UserRound } from "lucide-react";
import { currentEvent } from "@/lib/demo-data";

const nav = [
  ["Biljetter", "/biljetter"],
  ["Lastbilar", "/lastbilar"],
  ["Program", "/program"],
  ["Karta", "/karta"],
  ["Besök", "/besok"],
  ["Partners", "/partners"],
];

export function PublicHeader() {
  return (
    <header className="tm-header">
      <Link className="tm-brand" href="/">
        <span className="tm-brand-mark"><img src="/aseda-truckmeet-logo.png" alt="Åseda Truckmeet" /></span>
        <span>
          <strong>Åseda Truckmeet</strong>
          <small>{currentEvent.dateLabel}</small>
        </span>
      </Link>
      <nav className="tm-nav" aria-label="Huvudnavigation">
        {nav.map(([label, href]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="tm-header-actions">
        <Link className="tm-icon-link" href="/konto" aria-label="Mina sidor">
          <UserRound size={20} />
        </Link>
        <Link className="tm-ticket-link" href="/biljetter">
          <Ticket size={18} />
          Köp biljett
        </Link>
        <button className="tm-menu-button" aria-label="Öppna meny">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}

export function LiveMobileDock() {
  return (
    <nav className="tm-mobile-dock" aria-label="Snabbval under eventet">
      <Link href="/karta">
        <Map size={18} />
        Karta
      </Link>
      <Link href="/program">
        <CalendarDays size={18} />
        Program
      </Link>
      <Link href="/rosta">
        <Trophy size={18} />
        Rösta
      </Link>
      <Link href="/konto/biljetter">
        <Ticket size={18} />
        Biljetter
      </Link>
    </nav>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <footer className="tm-footer">
        <div>
          <strong>Truckmeet i syd ideell förening</strong>
          <p>Ekängsvägen 2, 577 71 Virserum</p>
        </div>
        <div>
          <a href="tel:+46495766060">0495-76 60 60</a>
          <a href="mailto:kontakt@asedatruckmeet.se">kontakt@asedatruckmeet.se</a>
        </div>
      </footer>
      <LiveMobileDock />
    </>
  );
}
