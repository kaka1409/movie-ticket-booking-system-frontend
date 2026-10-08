/**
 * Canonical site identity for SEO metadata (`metadata`, `generateMetadata`,
 * `robots.ts`, `sitemap.ts`). Kept in one module so every consumer resolves
 * the same absolute origin.
 */

/** Public origin of the deployed site — set before `pnpm build` in production. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "PrimeSeat";

export const DEFAULT_DESCRIPTION =
  "PrimeSeat is a movie ticket booking system — browse now showing and coming soon films, pick a showtime, choose your seats and book online in minutes.";

/** Default social-share image (served from `public/`, absolute path resolved via `metadataBase`). */
export const DEFAULT_OG_IMAGE = "/images/og-cover.png";
