import { NextResponse, type NextRequest } from "next/server";
import { IMAGE_HOSTS } from "@/libs/image-hosts";

/**
 * Per-request Content-Security-Policy. It lives here rather than in
 * `next.config.ts` because a static header cannot carry a nonce: Next reads
 * the policy off the request, extracts the nonce and stamps it on every
 * script it emits, so `script-src` drops `'unsafe-inline'`. Every route
 * renders dynamically (the root layout reads the locale cookie), which is
 * what makes a per-request nonce possible.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? null;
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

/** `ws://` + `wss://` for an http(s) origin — a CSP scheme is not a URL. */
function socketSchemesOf(httpOrigin: string): string[] {
  return [
    `ws://${httpOrigin.replace(/^https?:\/\//, "")}`,
    `wss://${httpOrigin.replace(/^https?:\/\//, "")}`,
  ];
}

const backendOrigin = new URL(BACKEND_URL).origin;
const connectSources = [
  ...new Set([
    backendOrigin,
    ...socketSchemesOf(backendOrigin),
    // The browser socket origin is often the same host as the API; a Set keeps
    // the policy free of duplicate sources.
    ...(SOCKET_URL
      ? [new URL(SOCKET_URL).origin, ...socketSchemesOf(new URL(SOCKET_URL).origin)]
      : []),
    // The dev server compiles on demand and the notification socket may dial a
    // LAN address the build never saw, so development opens up.
    ...(isDev ? ["http:", "https:", "ws:", "wss:"] : []),
  ]),
];

const IMG_SOURCES = IMAGE_HOSTS.map((host) => `https://${host}`).join(" ");

function buildPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    // `strict-dynamic` + nonce: the nonce'd bootstrap loads every chunk Next
    // needs, so `'self'` is redundant for modern browsers (kept for CSP2).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // qr-scanner decodes inside a Web Worker built from a blob: URL.
    "worker-src 'self' blob:",
    // Tailwind v4 injects <style> tags at runtime; Next stamps the nonce on the
    // ones it renders, but the dev overlay and inline style props still need this.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${IMG_SOURCES}`,
    "font-src 'self' data:",
    `connect-src 'self' ${connectSources.join(" ")}`,
    "frame-src 'self' https://maps.google.com https://www.google.com https://www.youtube-nocookie.com https://player.vimeo.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // Production only: a local `next start` is plain http:// and would be
    // upgraded into a scheme nothing listens on.
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

export function proxy(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = buildPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

/**
 * Same-origin API rewrites, static assets and Next internals are excluded: a
 * CSP header on a JSON body or a chunk does nothing, and skipping them keeps
 * the proxy off the hot path. Link prefetches return an RSC payload for a
 * document that already carries its own policy, so they are skipped too.
 */
export const config = {
  matcher: [
    {
      source: "/((?!api/|_next/|favicon.ico|manifest.json|robots.txt|sitemap.xml|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
