import type { NextConfig } from "next";
import path from "path";
import { IMAGE_HOSTS } from "./src/libs/image-hosts";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

const isDev = process.env.NODE_ENV === "development";

// A production build without a backend origin bakes `localhost` into the
// rewrites — every deployed request then fails with a connection error far from
// the cause. Throw at build time instead (`.env.local` / build env must carry it).
if (!isDev && !process.env.BACKEND_URL) {
  throw new Error("BACKEND_URL must be set for a production build (next.config.ts rewrites)");
}

// Extra dev origins beyond the built-in LAN list: ALLOWED_DEV_ORIGINS is a
// comma-separated host list for whatever network the dev machine sits on.
const envDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const devOrigins = ["10.25.34.154", "192.168.88.165", "192.168.1.9", ...envDevOrigins];

const nextConfig: NextConfig = {
  reactCompiler: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
    qualities: [75, 90],
  },
  // Dev-only LAN origins; never ship these to production.
  ...(isDev ? { allowedDevOrigins: devOrigins } : {}),
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  /**
   * Static security headers. The Content-Security-Policy is **not** here: it
   * needs a per-request nonce, so `src/proxy.ts` owns it (see that file).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=(self), payment=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
