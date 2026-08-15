type SponsorTier = "main" | "platinum" | "gold" | "silver" | "bronze";

type Sponsor = {
  name: string;
  tier: SponsorTier;
  description: string;
  website?: string;
  logoUrl?: string;
  sortOrder: number;
};

type SiteData = {
  hero: {
    kicker: string;
    title: string;
    body: string;
    imageUrl: string;
    primaryCta: string;
    primaryCtaUrl: string;
  };
  event: {
    heading: string;
    dateLabel: string;
    location: string;
    description: string;
    artists: string[];
  };
  stats: Array<{ value: string; label: string }>;
  sponsors: Sponsor[];
  program: Array<{ time: string; title: string; description: string }>;
  gallery: Array<{ url: string; alt: string }>;
};

export const sponsorTierMeta: Record<
  SponsorTier,
  { label: string; description: string }
> = {
  main: {
    label: "Huvudpartner",
    description: "Största synlighet över hela evenemanget.",
  },
  platinum: {
    label: "Platinapartner",
    description: "Premiumexponering på webb, område och kommunikation.",
  },
  gold: {
    label: "Guldpartners",
    description: "Tydlig exponering för åkerinäringen och publiken.",
  },
  silver: {
    label: "Silverpartners",
    description: "Synlighet i partnerlistan och eventkommunikationen.",
  },
  bronze: {
    label: "Bronspartners",
    description: "Lokal närvaro och stöd till evenemanget.",
  },
};

const fallbackData: SiteData = {
  hero: {
    kicker: "26-28 juni 2026 · Åseda Folkets Park",
    title: "Upplev magin med Åseda Truckmeet - 10 år",
    body: "Årets upplaga blir en maxad helg med lastbilar, festival, familjedag, branschutställare och scenprogram med Pipex, Da Buzz, Maskinen, 2 Blyga läppar, J.O.X och LBSB.",
    imageUrl: "https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp",
    primaryCta: "Köp biljett",
    primaryCtaUrl: "/butik",
  },
  event: {
    heading: "En helg för lastbilsfolk, publik och familjer",
    dateLabel: "26-28 juni",
    location: "Åseda Folkets Park",
    description:
      "Åseda Truckmeet arrangeras helgen efter midsommar och samlar utställande lastbilar, branschutställare, mat, musik och familjeaktiviteter i en trygg och ordnad folkfest.",
    artists: ["Pipex", "Da Buzz", "Maskinen", "2 Blyga läppar", "J.O.X", "LBSB"],
  },
  stats: [
    { value: "10 år", label: "jubileum 2026" },
    { value: "160+", label: "lastbilar senast" },
    { value: "2", label: "festivaldagar" },
    { value: "5", label: "sponsornivåer" },
  ],
  sponsors: [
    {
      name: "JSC Koncernen",
      tier: "main",
      description:
        "Huvudpartner till Åseda Truckmeet 2026. JSC löser logistikproblem på ett enkelt sätt.",
      website: "https://www.jscforvaltning.se",
      logoUrl:
        "https://asedatruckmeet.se/web/image/3821-d9abdff8/JSC-Koncernen-1-1400x560.png",
      sortOrder: 1,
    },
    {
      name: "Uppvidinge Kommun",
      tier: "platinum",
      description:
        "Platinapartner med nära samarbete kring ett tryggt och ordnat evenemang.",
      website: "https://www.uppvidinge.se",
      logoUrl:
        "https://asedatruckmeet.se/web/image/4640-65932a72/Logotyp_uppvidinge_staende_original.webp",
      sortOrder: 2,
    },
    {
      name: "Kompetensportalen.se",
      tier: "gold",
      description:
        "Erbjuder kurser i Arbete på väg och ett växande kursutbud till konkurrenskraftiga priser.",
      website: "https://www.kompetensportalen.se",
      sortOrder: 3,
    },
    {
      name: "VIBO Fastigheter",
      tier: "gold",
      description: "Erbjuder lägenheter i Hultsfreds kommun.",
      website: "https://vibofast.se",
      sortOrder: 4,
    },
    {
      name: "Mias Butik - Frendo Åseda",
      tier: "gold",
      description:
        "Ett naturligt stopp i Åseda för mat, fika och diesel längs vägen.",
      sortOrder: 5,
    },
    {
      name: "Kronqvists Åkeri",
      tier: "gold",
      description:
        "Familjeföretag inom entreprenad och åkeri i tredje generationen.",
      website: "https://www.kronqvists.se",
      sortOrder: 6,
    },
    {
      name: "ProfilGruppen",
      tier: "gold",
      description:
        "Utvecklar och tillverkar kundanpassade profiler och komponenter i aluminium.",
      website: "https://www.profilgruppen.se",
      sortOrder: 7,
    },
    {
      name: "SVEA",
      tier: "silver",
      description:
        "Finansiell koncern med lång erfarenhet av att hjälpa företag med likviditet.",
      website: "https://www.svea.com",
      sortOrder: 8,
    },
    {
      name: "B-Trans Norra Vi",
      tier: "silver",
      description:
        "Åkeriföretag från Ydre med fokus på vägtransport och godstransporter.",
      sortOrder: 9,
    },
    {
      name: "Clear Defend",
      tier: "silver",
      description:
        "Modellanpassad skyddsfolie som skyddar hytter mot stenskott, repor och dagligt slitage.",
      website: "https://www.cleardefend.se",
      sortOrder: 10,
    },
    {
      name: "Tord Nilsson Åkeri",
      tier: "bronze",
      description:
        "Familjeföretag baserat i Asarum med transporter inom avfall, asfalt och jordbruksprodukter.",
      website: "https://www.tordnilsson.se",
      sortOrder: 11,
    },
    {
      name: "Hotell Olof",
      tier: "bronze",
      description:
        "Boende i centrala Åseda, nära Glasriket och evenemangsområdet.",
      sortOrder: 12,
    },
  ],
  program: [
    {
      time: "Fredag 14:00-20:00",
      title: "Insläpp för ekipage",
      description:
        "Utställande fordon tas emot och placeras på området inför helgens träff.",
    },
    {
      time: "Fredag kväll",
      title: "Festivalstart",
      description:
        "Scenprogram, mat, dryck och kvällsstämning i Folkets Park.",
    },
    {
      time: "Lördag 08:00-09:00",
      title: "Sista fordonsinsläpp",
      description:
        "Efter insläppet stängs fordonsrörelser på området av säkerhetsskäl.",
    },
    {
      time: "Lördag dag",
      title: "Familjedag",
      description:
        "Aktiviteter för hela familjen, branschutställare och möjlighet att rösta fram årets finaste lastbil.",
    },
  ],
  gallery: [
    {
      url: "https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp",
      alt: "Publik vid entrén till Åseda Truckmeet.",
    },
    {
      url: "https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp",
      alt: "Festivalstämning i Åseda Folkets Park.",
    },
  ],
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchTable<T>(table: string, query = "select=*") {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T[];
}

export async function getSiteData(): Promise<SiteData> {
  const [settingsRows, sponsorsRows, programRows, galleryRows] =
    await Promise.all([
      fetchTable<Record<string, unknown>>("site_settings"),
      fetchTable<Record<string, unknown>>(
        "sponsors",
        "select=*&is_active=eq.true&order=sort_order.asc",
      ),
      fetchTable<Record<string, unknown>>(
        "program_items",
        "select=*&is_active=eq.true&order=sort_order.asc",
      ),
      fetchTable<Record<string, unknown>>(
        "gallery_images",
        "select=*&is_active=eq.true&order=sort_order.asc",
      ),
    ]);

  if (!settingsRows || !sponsorsRows || !programRows || !galleryRows) {
    return fallbackData;
  }

  const settings = settingsRows[0] ?? {};

  return {
    hero: {
      kicker: String(settings.hero_kicker ?? fallbackData.hero.kicker),
      title: String(settings.hero_title ?? fallbackData.hero.title),
      body: String(settings.hero_body ?? fallbackData.hero.body),
      imageUrl: String(settings.hero_image_url ?? fallbackData.hero.imageUrl),
      primaryCta: String(settings.primary_cta ?? fallbackData.hero.primaryCta),
      primaryCtaUrl: String(
        settings.primary_cta_url ?? fallbackData.hero.primaryCtaUrl,
      ),
    },
    event: {
      heading: String(settings.event_heading ?? fallbackData.event.heading),
      dateLabel: String(settings.event_date_label ?? fallbackData.event.dateLabel),
      location: String(settings.event_location ?? fallbackData.event.location),
      description: String(
        settings.event_description ?? fallbackData.event.description,
      ),
      artists: Array.isArray(settings.artists)
        ? settings.artists.map(String)
        : fallbackData.event.artists,
    },
    stats: fallbackData.stats,
    sponsors: sponsorsRows.map((row, index) => ({
      name: String(row.name ?? ""),
      tier: String(row.tier ?? "bronze") as SponsorTier,
      description: String(row.description ?? ""),
      website: row.website ? String(row.website) : undefined,
      logoUrl: row.logo_url ? String(row.logo_url) : undefined,
      sortOrder: Number(row.sort_order ?? index),
    })),
    program: programRows.map((row) => ({
      time: String(row.time_label ?? ""),
      title: String(row.title ?? ""),
      description: String(row.description ?? ""),
    })),
    gallery: galleryRows.map((row) => ({
      url: String(row.image_url ?? ""),
      alt: String(row.alt ?? "Bild från Åseda Truckmeet"),
    })),
  };
}
