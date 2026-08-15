import type { MetadataRoute } from "next";
import { trucks } from "@/lib/demo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://asedatruckmeet.se";
  const staticRoutes = [
    "",
    "/biljetter",
    "/lastbilar",
    "/program",
    "/karta",
    "/rosta",
    "/partners",
    "/utstallare",
    "/besok",
    "/for-deltagare",
    "/fragor-svar",
    "/nyheter",
    "/galleri",
    "/aftermovies",
    "/om",
    "/arkiv/2026",
    "/integritet",
    "/villkor",
  ];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}` })),
    ...trucks
      .filter((truck) => truck.status === "APPROVED")
      .map((truck) => ({ url: `${base}/lastbilar/${truck.slug}` })),
  ];
}
