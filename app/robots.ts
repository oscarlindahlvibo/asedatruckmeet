import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/konto/"],
    },
    sitemap: "https://asedatruckmeet.se/sitemap.xml",
  };
}
