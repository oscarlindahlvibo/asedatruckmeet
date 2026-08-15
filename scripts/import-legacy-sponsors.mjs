import fs from "node:fs/promises";
import path from "node:path";

const sourceUrl = "https://asedatruckmeet.se/";
const root = process.cwd();
const outputDir = path.join(root, "public", "imported-sponsors");
const dataDir = path.join(root, "data");

function clean(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#39;|&apos;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function absoluteUrl(value) {
  return new URL(value.replaceAll("%2520", "%20"), sourceUrl).toString();
}

function extractImage(block) {
  const match = block.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? absoluteUrl(match[1]) : null;
}

function extractLink(block) {
  const matches = [...block.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]).filter((url) => !url.startsWith("#") && !url.startsWith("/"));
  return matches.at(-1) ?? null;
}

function extractCard(block, tier) {
  const name = clean(block.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i)?.[1]);
  if (!name || /vill du synas här|kontakta oss/i.test(name)) return null;
  const description = clean(block.match(/<p class=["']card-text["'][^>]*>([\s\S]*?)<\/p>/i)?.[1]);
  return { name, slug: slugify(name), tier, description, websiteUrl: extractLink(block), sourceLogoUrl: extractImage(block), sourceUrl };
}

const html = await (await fetch(sourceUrl)).text();
const sponsors = [];
for (const [heading, tier, endHeading] of [["GULDPARTNERS", "Guldpartner", "SILVERPARTNERS"], ["SILVERPARTNERS", "Silverpartner", "BRONSPARTNERS"], ["BRONSPARTNERS", "Bronspartner", null]]) {
  const start = html.indexOf(heading);
  const end = endHeading ? html.indexOf(endHeading, start) : html.length;
  const section = html.slice(start, end < 0 ? html.length : end);
  for (const match of section.matchAll(/<div[^>]+data-name=["']Card["'][\s\S]*?(?=<div[^>]+data-name=["']Card["']|<h2|<\/main>)/gi)) {
    const card = extractCard(match[0], tier);
    if (card) sponsors.push(card);
  }
}

for (const [heading, tier] of [["Huvudpartner", "Huvudpartner"], ["Platinapartner", "Platinapartner"]]) {
  const start = html.indexOf(`<h3>${heading}</h3>`);
  const section = html.slice(start, start + 10000);
  const name = clean(section.match(/<p[^>]+class=["']lead["'][^>]*>([\s\S]*?)<\/p>/i)?.[1]).replace(/^Vi kan stolt presentera(?: att)?\s*/i, "").replace(/ som huvudpartner.*$/i, "").replace(/ går in som Platinapartner.*$/i, "").trim();
  const paragraphs = [...section.matchAll(/<p[^>]+class=["']lead["'][^>]*>([\s\S]*?)<\/p>/gi)].map((match) => clean(match[1])).filter(Boolean);
  const logo = extractImage(section);
  const url = extractLink(section);
  if (name) sponsors.unshift({ name, slug: slugify(name), tier, description: paragraphs.join(" "), websiteUrl: url, sourceLogoUrl: logo, sourceUrl });
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(dataDir, { recursive: true });
const imported = [];
for (const sponsor of sponsors) {
  let logoPath = null;
  if (sponsor.sourceLogoUrl) {
    const response = await fetch(sponsor.sourceLogoUrl);
    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      const extension = contentType.includes("svg") ? "svg" : contentType.includes("png") ? "png" : "webp";
      logoPath = `/imported-sponsors/${sponsor.slug}.${extension}`;
      await fs.writeFile(path.join(root, "public", logoPath.slice(1)), Buffer.from(await response.arrayBuffer()));
    }
  }
  imported.push({ ...sponsor, logoPath });
}

await fs.writeFile(path.join(dataDir, "legacy-sponsors.json"), `${JSON.stringify({ importedAt: new Date().toISOString(), sourceUrl, sponsors: imported }, null, 2)}\n`);
console.log(`Imported ${imported.length} legacy sponsors into data/legacy-sponsors.json`);
