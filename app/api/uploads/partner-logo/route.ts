import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { requireAdminRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const access = await requireAdminRole(["SUPER_ADMIN", "EVENT_ADMIN", "CONTENT_EDITOR"]);
  if (access.error) return NextResponse.json({ error: access.error }, { status: access.error === "FORBIDDEN" ? 403 : 401 });
  const storage = getStorageClient();
  if (!storage) return NextResponse.json({ error: "Objektlagring är inte konfigurerad." }, { status: 503 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")) return NextResponse.json({ error: "Logotypen måste vara en bild under 5 MB." }, { status: 400 });
  const event = await prisma.event.findFirst({ orderBy: { year: "desc" } });
  if (!event) return NextResponse.json({ error: "Event saknas." }, { status: 400 });
  const key = `events/${event.id}/partners/${Date.now()}-logo.webp`;
  const source = Buffer.from(await file.arrayBuffer());
  const output = await sharp(source, { failOn: "error" }).rotate().resize({ width: 1200, height: 500, fit: "inside", withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
  await storage.client.send(new PutObjectCommand({ Bucket: storage.config.bucket, Key: key, Body: output, ContentType: "image/webp" }));
  const publicUrl = storage.config.publicBaseUrl ? `${storage.config.publicBaseUrl.replace(/\/$/, "")}/${key}` : null;
  const asset = await prisma.mediaAsset.create({ data: { eventId: event.id, bucket: storage.config.bucket, objectKey: key, publicUrl, mimeType: "image/webp", sizeBytes: output.byteLength, variants: {} } });
  return NextResponse.json({ assetId: asset.id, url: publicUrl });
}
