import { useActiveEvent } from '@/hooks/useEvent';
import { useCountdown } from '@/hooks/useCountdown';
import { SITE_CONFIG } from '@/config';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[4.5rem] text-center sm:min-w-[6.5rem]">
      <div className="border border-white/15 bg-black/35 px-3 py-4 sm:px-5 sm:py-5">
        <span className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function ComingSoonPage() {
  const { event } = useActiveEvent();
  const target = import.meta.env.VITE_TICKETS_RELEASE_AT || event?.countdown_target || SITE_CONFIG.eventStartDate;
  const { days, hours, minutes, seconds } = useCountdown(target);
  const year = event?.year ?? SITE_CONFIG.year;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.13),transparent_34%),linear-gradient(135deg,#090909_0%,#17110a_52%,#080808_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      <div className="absolute -left-24 top-1/3 h-px w-[130%] rotate-[-12deg] bg-amber-500/10" />
      <div className="absolute -left-24 top-[58%] h-px w-[130%] rotate-[-12deg] bg-white/5" />

      <div className="relative z-10 w-full max-w-5xl text-center">
        <img
          src="/aseda-truckmeet-logo.png"
          alt="Åseda Truckmeet"
          className="mx-auto mb-14 h-16 w-auto brightness-0 invert sm:h-24"
        />

        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.42em] text-amber-400 sm:text-sm">
          Nästa kapitel · {year}
        </p>
        <h1 className="font-heading text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-8xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          Vi bygger nästa Åseda Truckmeet. Biljetterna släpps snart.
        </p>

        <div className="mx-auto mt-12 max-w-3xl border-y border-white/10 py-8 sm:mt-16 sm:py-10">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-white/45 sm:text-sm">
            Biljettsläpp
          </p>
          <div className="flex justify-center gap-2 sm:gap-5">
            <TimeUnit value={days} label="Dagar" />
            <TimeUnit value={hours} label="Timmar" />
            <TimeUnit value={minutes} label="Minuter" />
            <TimeUnit value={seconds} label="Sekunder" />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>{event?.location || SITE_CONFIG.location}</span>
          <span className="text-white/20">·</span>
          <span>{event ? new Date(event.start_date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }) : SITE_CONFIG.dates}</span>
        </div>
      </div>
    </main>
  );
}
