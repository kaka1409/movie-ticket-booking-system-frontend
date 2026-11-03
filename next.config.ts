import type { NextConfig } from "next";
import path from "path";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

// Build-time CSP allow-lists. `rewrites()` and `headers()` are evaluated at
// build time, so these reflect the env present during `pnpm build`.
const backendOrigin = new URL(BACKEND_URL).origin;
const backendWsOrigin = backendOrigin.replace(/^http/, "ws");

const IMAGE_HOSTS = [
  "i.ebayimg.com",
  "cdn11.bigcommerce.com",
  "cdn.dribbble.com",
  "encrypted-tbn0.gstatic.com",
  "m.media-amazon.com",
  "upload.wikimedia.org",
  "image.tmdb.org",
  "lumiere-a.akamaihd.net",
  "i.pravatar.cc",
  "images.ctfassets.net",
  "flagcdn.com",
];

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: false,
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  // Dev-only LAN origins; never ship these to production.
  ...(isDev ? { allowedDevOrigins: ["10.25.33.35", "192.168.88.165", "192.168.1.9"] } : {}),
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${IMAGE_HOSTS.map((h) => `https://${h}`).join(" ")}`,
      "font-src 'self' data:",
      `connect-src 'self' ${backendOrigin} ${backendWsOrigin} ${backendWsOrigin.replace(/^ws/, "wss")}`,
      "frame-src 'self' https://maps.google.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "Content-Security-Policy", value: csp },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
