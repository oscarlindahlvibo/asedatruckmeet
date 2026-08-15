import type { Role } from "@prisma/client";

export type Truck = {
  truckNumber: string;
  slug: string;
  companyName: string;
  city: string;
  country: string;
  brand: string;
  model: string;
  modelYear: number;
  category: string;
  competitionClass: string;
  description: string;
  mainImageUrl: string;
  status: "APPROVED" | "PENDING_APPROVAL" | "INCOMPLETE" | "HIDDEN";
  publicConsent: boolean;
  publicProfile: boolean;
  publicRegistration: boolean;
  registrationNumber: string;
  instagramUrl?: string;
};

export const currentEvent = {
  id: "demo-event-2027",
  year: 2027,
  name: "Åseda Truckmeet 2027",
  slug: "aseda-truckmeet-2027",
  stage: "ANNOUNCED",
  startsAt: "2027-07-02T12:00:00+02:00",
  endsAt: "2027-07-03T02:00:00+02:00",
  ticketSalesOpenAt: "2026-11-01T10:00:00+01:00",
  dateLabel: "2-3 juli 2027",
  locationName: "Åseda Folkets Park",
  locationAddress: "Trädgårdsgatan 15, Åseda",
  heroTitle: "ÅSEDA TRUCKMEET",
  heroKicker: "Småland. Lastbilar. Folkfest.",
  heroLead:
    "Två dagar med showtrucks, krom, fordonsljus, festival, mat, branschfolk och gemenskap i Åseda.",
  heroImageUrl: "https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp",
  pretixEventUrl: process.env.NEXT_PUBLIC_PRETIX_EVENT_URL ?? "https://pretix.example.com/truckmeet/2027/",
};

export const liveStats = [
  { id: "trucks", value: 187, label: "Anmälda lastbilar", enabled: true },
  { id: "tickets", value: 12480, label: "Sålda biljetter", enabled: true },
  { id: "partners", value: 34, label: "Partners", enabled: true },
  { id: "days", value: 2, label: "Dagar", enabled: true },
];

export const partnerTiers = [
  { name: "Huvudpartner", slug: "huvudpartner", rank: 1 },
  { name: "Platinapartner", slug: "platinapartner", rank: 2 },
  { name: "Guldpartner", slug: "guldpartner", rank: 3 },
  { name: "Silverpartner", slug: "silverpartner", rank: 4 },
  { name: "Bronspartner", slug: "bronspartner", rank: 5 },
];

export const partners = [
  "JSC Koncernen",
  "Uppvidinge Kommun",
  "TruckStyle Sweden",
  "Kompetensportalen.se",
  "VIBO Fastigheter",
  "Mias Butik - Frendo Åseda",
  "Kronqvists Åkeri",
  "ProfilGruppen",
  "Högsby Sparbank",
  "Däckteam Åseda",
  "Clear Defend",
  "Åseda Tung Service",
  "Finnvedens Lastvagnar",
  "SLP AB",
  "Hotell Olof",
].map((name, index) => ({
  name: `DEMO ${name}`,
  slug: name.toLowerCase().replaceAll(" ", "-").replaceAll(".", "").replaceAll("å", "a").replaceAll("ä", "a").replaceAll("ö", "o"),
  tier: index === 0 ? "Huvudpartner" : index < 3 ? "Platinapartner" : index < 7 ? "Guldpartner" : index < 12 ? "Silverpartner" : "Bronspartner",
  description:
    "DEMO Partnerpresentation som visar hur sponsorprofiler kommer att fungera i den nya plattformen.",
  websiteUrl: "https://asedatruckmeet.se",
  booth: index % 3 === 0 ? `M${index + 1}` : undefined,
  initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase(),
}));

export const exhibitors = Array.from({ length: 10 }, (_, index) => ({
  name: `DEMO Utställare ${index + 1}`,
  slug: `demo-utstallare-${index + 1}`,
  category: ["Tillbehör", "Åkeri", "Mat", "Service", "Belysning"][index % 5],
  description:
    "DEMO Kommersiell utställare med monter, erbjudande och koppling till karta.",
  booth: `U${index + 1}`,
  websiteUrl: "https://asedatruckmeet.se",
}));

const brands = ["Scania", "Volvo", "Mercedes-Benz", "MAN", "DAF", "Iveco"];
const cities = ["Kalmar", "Växjö", "Vetlanda", "Oskarshamn", "Nybro", "Hultsfred", "Åseda", "Jönköping"];
const models = ["770S V8", "FH16 750", "Actros L", "TGX", "XF", "S-Way"];
const categories = ["showtruck", "veteran", "specialtransport", "dragbil", "ekipage"];

export const trucks: Truck[] = Array.from({ length: 30 }, (_, index) => {
  const brand = brands[index % brands.length];
  const model = models[index % models.length];
  const number = `B${String(index + 101).padStart(3, "0")}`;

  return {
    truckNumber: number,
    slug: `${number.toLowerCase()}-demo-${brand.toLowerCase().replace("-", "")}-${index + 1}`,
    companyName: `DEMO ${cities[index % cities.length]} Åkeri`,
    city: cities[index % cities.length],
    country: "Sverige",
    brand,
    model,
    modelYear: 1998 + (index % 27),
    category: categories[index % categories.length],
    competitionClass: index % 4 === 0 ? "Showtruck" : "Publikens val",
    description:
      "DEMO Lastbilsprofil med publik text, bilder och tävlingsklass. Skarp data fylls i av fordonsägaren efter köp av fordonsbiljett.",
    mainImageUrl: [
      "https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp",
      "https://asedatruckmeet.se/web/image/3831-0f1c1eb6/DSC_2134.webp",
      "https://asedatruckmeet.se/web/image/3835-0e415e0c/DJI_0723.webp",
    ][index % 3],
    status: index % 9 === 0 ? "PENDING_APPROVAL" : "APPROVED",
    publicConsent: index % 9 !== 0,
    publicProfile: index % 9 !== 0,
    publicRegistration: false,
    registrationNumber: `DEMO${index + 100}`,
    instagramUrl: "https://instagram.com/asedatruckmeet",
  };
});

export const programItems = [
  ["Fredag 14:00", "Insläpp utställande fordon", "Utställande lastbilar checkas in och placeras."],
  ["Fredag 18:00", "Området öppnar", "Mat, barer, utställare och första scenprogrammet öppnar."],
  ["Fredag 21:00", "DEMO Live: Main stage", "Kvällens första större artist."],
  ["Lördag 09:00", "Sista fordonsinsläpp", "Efter detta hålls området bilfritt för publik."],
  ["Lördag 11:00", "Familjedag", "Aktiviteter, barnområde och öppet lastbilsområde."],
  ["Lördag 15:00", "Truck parade moments", "Utvalda presentationer och intervjuer."],
  ["Lördag 18:00", "Publikens val öppnar", "Röstning via mobil för godkända truckprofiler."],
  ["Lördag 23:30", "Prisutdelning", "Vinnare presenteras från scen."],
].map(([time, title, description], index) => ({
  time,
  title,
  slug: `demo-program-${index + 1}`,
  description,
  place: index > 1 ? "Stora scenen" : "Entré/området",
  category: index > 1 ? "Festival" : "Besökare",
}));

export const faqs = [
  ["Hitta hit", "Åseda Truckmeet genomförs i Åseda Folkets Park på Trädgårdsgatan 15."],
  ["Insläpp fordon", "Fredag 14-20 och lördag 08-09. Övrig tid är området stängt för fordonstrafik."],
  ["Biljetter", "Biljetter köps via Pretix. Originalbiljett och kvitto hanteras av Pretix."],
  ["Parkering", "Besöksparkering sker på anvisade ytor. Följ skyltning och funktionärer."],
  ["Familjedag", "Lördag dag är familjedag med aktiviteter för hela familjen."],
  ["Väskförbud", "Eventuellt väskförbud styrs av myndighetsbeslut och uppdateras i besöksinformationen."],
];

export const mapPois = [
  { name: "Entré Norr", slug: "entre-norr", category: "entré", icon: "ticket", x: 12, y: 24 },
  { name: "Stora scenen", slug: "stora-scenen", category: "scen", icon: "music", x: 54, y: 38 },
  { name: "WC Parken", slug: "wc-parken", category: "wc", icon: "wc", x: 76, y: 22 },
  { name: "Matgata", slug: "matgata", category: "mat", icon: "utensils", x: 42, y: 62 },
  { name: "Sjukvård", slug: "sjukvard", category: "sjukvård", icon: "cross", x: 18, y: 70 },
  { name: "Showtruck B-område", slug: "showtruck-b", category: "lastbil", icon: "truck", x: 68, y: 70 },
];

export const mapRoutes = [
  {
    name: "Entré Norr - Rekommenderad runda",
    slug: "entre-norr",
    points: [
      [12, 24],
      [34, 34],
      [54, 38],
      [68, 70],
      [42, 62],
      [18, 70],
    ],
  },
];

export const adminMetrics = [
  { label: "Biljetter", value: "12 481", source: "Pretix read model" },
  { label: "Omsättning", value: "DEMO 4 820 000 kr", source: "Pretix" },
  { label: "Anmälda lastbilar", value: "314", source: "Truckplattform" },
  { label: "Publicerade profiler", value: "287", source: "Moderering" },
  { label: "Checkat in", value: "8 421", source: "PretixSCAN" },
  { label: "Röster", value: "5 812", source: "Publikens val" },
];

export const demoAdmin = {
  id: "demo-admin",
  email: "admin@asedatruckmeet.se",
  roles: ["SUPER_ADMIN"] as Role[],
};
