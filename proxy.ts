import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pretixBase = process.env.PRETIX_BASE_URL ?? "https://pretix.example.com";

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)",
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' " + pretixBase,
      "style-src 'self' 'unsafe-inline' " + pretixBase,
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' " + pretixBase,
      "frame-src 'self' " + pretixBase,
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' " + pretixBase,
    ].join("; "),
  );

  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|sw.js).*)"],
};
