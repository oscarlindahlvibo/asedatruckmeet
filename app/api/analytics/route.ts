import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    stored: process.env.DATABASE_URL ? "database" : "demo-memory",
    type: body.type ?? "unknown",
  });
}
