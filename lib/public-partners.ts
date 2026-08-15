import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";
import { partnerTiers as demoTiers, partners as demoPartners } from "@/lib/demo-data";

export type PublicPartner = (typeof demoPartners)[number] & { logoUrl: string | null };

function getFallbackPartners() {
  try {
    const legacy = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "legacy-sponsors.json"), "utf8")) as { sponsors: Array<{ name: string; slug: string; tier: string; description: string; websiteUrl: string | null; logoPath: string | null }> };
    return legacy.sponsors.map((partner) => ({ ...partner, booth: undefined, initials: initials(partner.name), logoUrl: partner.logoPath })) as PublicPartner[];
  } catch {
    return demoPartners.map((partner) => ({ ...partner, logoUrl: null })) as PublicPartner[];
  }
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

export async function getPublicPartnerContent() {
  try {
    const event = await prisma.event.findFirst({ orderBy: { year: "desc" } });
    if (!event) return { tiers: demoTiers, partners: getFallbackPartners() };
    const [tiers, records] = await Promise.all([
      prisma.partnerTier.findMany({ where: { eventId: event.id, isPublic: true }, orderBy: { rank: "asc" } }),
      prisma.partner.findMany({ where: { eventId: event.id, isPublic: true }, include: { tier: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    ]);
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: records.map((record) => record.logoAssetId).filter((id): id is string => Boolean(id)) } }, select: { id: true, publicUrl: true } });
    const assetMap = new Map(assets.map((asset) => [asset.id, asset.publicUrl]));
    return { tiers: tiers.map((tier) => ({ name: tier.name, slug: tier.slug, rank: tier.rank })), partners: records.map((record) => ({ name: record.name, slug: record.slug, tier: record.tier?.name ?? "Partner", description: record.description ?? "", websiteUrl: record.websiteUrl ?? "", booth: record.booth ?? undefined, initials: initials(record.name), logoUrl: record.logoAssetId ? assetMap.get(record.logoAssetId) : null })) as PublicPartner[] };
  } catch {
    return { tiers: demoTiers, partners: getFallbackPartners() };
  }
}

export async function getPublicPartner(slug: string) {
  const content = await getPublicPartnerContent();
  return content.partners.find((partner) => partner.slug === slug) ?? null;
}
