import { NextResponse, type NextRequest } from "next/server";

/**
 * Rate limiting in-memory (para producción a gran escala, sustituir por
 * Upstash Redis @upstash/ratelimit). Ventana fija de 60s por IP.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }
  bucket.count++;
  if (buckets.size > 10_000) buckets.clear(); // anti leak
  return { ok: bucket.count <= MAX_REQUESTS, remaining: Math.max(0, MAX_REQUESTS - bucket.count) };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit solo rutas API
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const { ok, remaining } = rateLimit(ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Inténtalo de nuevo en un minuto." },
        { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
      );
    }
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
