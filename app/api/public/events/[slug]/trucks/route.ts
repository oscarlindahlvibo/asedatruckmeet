import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function corsHeaders() {
  return { "Access-Control-Allow-Origin": process.env.APP_ORIGIN ?? "https://app.asedatruckmeet.se", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Cache-Control": "public, max-age=60, s-maxage=60" };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 30) || 30));
  const search = url.searchParams.get("search")?.trim();
  const brand = url.searchParams.get("brand")?.trim();
  const category = url.searchParams.get("category")?.trim();
  const event = await prisma.event.findUnique({ where: { slug }, select: { id: true, year: true, name: true } });
  if (!event) return NextResponse.json({ error: "Event saknas" }, { status: 404, headers: corsHeaders() });
  const where = { eventId: event.id, status: "APPROVED" as const, publicConsent: true, ...(search ? { OR: [{ companyName: { contains: search, mode: "insensitive" as const } }, { model: { contains: search, mode: "insensitive" as const } }, { city: { contains: search, mode: "insensitive" as const } }, { truckNumber: { contains: search, mode: "insensitive" as const } }] } : {}), ...(brand ? { brand: { equals: brand, mode: "insensitive" as const } } : {}), ...(category ? { category: { equals: category, mode: "insensitive" as const } } : {}) };
  const [total, trucks] = await Promise.all([prisma.truckProfile.count({ where }), prisma.truckProfile.findMany({ where, orderBy: [{ truckNumber: "asc" }], skip: (page - 1) * limit, take: limit, select: { id: true, slug: true, truckNumber: true, companyName: true, city: true, country: true, brand: true, model: true, modelYear: true, category: true, competitionClass: true, description: true, instagramUrl: true, facebookUrl: true, websiteUrl: true, mainImageAssetId: true } })]);
  const assets = await prisma.mediaAsset.findMany({ where: { id: { in: trucks.map((truck) => truck.mainImageAssetId).filter((id): id is string => Boolean(id)) } }, select: { id: true, publicUrl: true } });
  const assetMap = new Map(assets.map((asset) => [asset.id, asset.publicUrl]));
  return NextResponse.json({ event, page, limit, total, pages: Math.ceil(total / limit), trucks: trucks.map(({ mainImageAssetId, ...truck }) => ({ ...truck, imageUrl: mainImageAssetId ? assetMap.get(mainImageAssetId) ?? null : null, profileUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://asedatruckmeet.se"}/lastbilar/${truck.slug}` })) }, { headers: corsHeaders() });
}
