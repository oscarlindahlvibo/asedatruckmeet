import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Du måste vara inloggad." }, { status: 401 });
  const storage = getStorageClient();
  if (!storage) return NextResponse.json({ error: "Objektlagring är inte konfigurerad." }, { status: 503 });

  const form = await request.formData();
  const truckId = String(form.get("truckId") ?? "");
  const file = form.get("file");
  const isMain = String(form.get("isMain") ?? "false") === "true";
  if (!truckId || !(file instanceof File)) return NextResponse.json({ error: "Truckprofil och bild krävs." }, { status: 400 });
  if (file.size > 12 * 1024 * 1024 || !file.type.startsWith("image/")) return NextResponse.json({ error: "Bilden måste vara en bild under 12 MB." }, { status: 400 });

  const truck = await prisma.truckProfile.findFirst({ where: { id: truckId, ownerUserId: user.id } });
  if (!truck) return NextResponse.json({ error: "Truckprofilen kunde inte hittas." }, { status: 404 });

  const source = Buffer.from(await file.arrayBuffer());
  const image = sharp(source, { failOn: "error" });
  const metadata = await image.metadata();
  const originalKey = `events/${truck.eventId}/trucks/${truck.id}/${Date.now()}-original.webp`;
  const thumbKey = `events/${truck.eventId}/trucks/${truck.id}/${Date.now()}-thumb.webp`;
  const [original, thumb] = await Promise.all([
    image.clone().rotate().resize({ width: 2400, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer(),
    image.clone().rotate().resize({ width: 720, height: 480, fit: "cover" }).webp({ quality: 78 }).toBuffer(),
  ]);
  await Promise.all([
    storage.client.send(new PutObjectCommand({ Bucket: storage.config.bucket, Key: originalKey, Body: original, ContentType: "image/webp" })),
    storage.client.send(new PutObjectCommand({ Bucket: storage.config.bucket, Key: thumbKey, Body: thumb, ContentType: "image/webp" })),
  ]);
  const publicUrl = storage.config.publicBaseUrl ? `${storage.config.publicBaseUrl.replace(/\/$/, "")}/${originalKey}` : null;
  const asset = await prisma.mediaAsset.create({ data: { eventId: truck.eventId, bucket: storage.config.bucket, objectKey: originalKey, publicUrl, mimeType: "image/webp", sizeBytes: original.byteLength, width: metadata.width, height: metadata.height, variants: { thumbnail: thumbKey } } });
  await prisma.truckProfileMedia.create({ data: { truckProfileId: truck.id, mediaAssetId: asset.id, sortOrder: isMain ? 0 : 100 } });
  if (isMain) await prisma.truckProfile.update({ where: { id: truck.id }, data: { mainImageAssetId: asset.id } });
  return NextResponse.json({ ok: true, assetId: asset.id, url: publicUrl });
}
