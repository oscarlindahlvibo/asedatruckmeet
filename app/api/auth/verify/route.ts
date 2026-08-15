import { NextResponse } from "next/server";
import { consumeMagicLink, setSessionCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/konto?error=missing-link", request.url));
  const result = await consumeMagicLink(token);
  if (!result) return NextResponse.redirect(new URL("/konto?error=invalid-link", request.url));
  await setSessionCookie(result.rawSession);
  return NextResponse.redirect(new URL("/konto?verified=1", request.url));
}
