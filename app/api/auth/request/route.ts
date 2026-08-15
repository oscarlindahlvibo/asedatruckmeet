import { NextResponse } from "next/server";
import { z } from "zod";
import { requestMagicLink, sendMagicLink } from "@/lib/auth";

const schema = z.object({ email: z.string().email().max(200) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Ange en giltig e-postadress." }, { status: 400 });
  const token = await requestMagicLink(parsed.data.email);
  await sendMagicLink(parsed.data.email, token);
  const response: { ok: true; previewUrl?: string } = { ok: true };
  if (process.env.NODE_ENV !== "production") {
    response.previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/verify?token=${encodeURIComponent(token)}`;
  }
  return NextResponse.json(response);
}
