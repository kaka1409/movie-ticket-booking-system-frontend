import { publicEnv } from "@/libs/env/public";

/**
 * Canonical site identity for SEO metadata (`metadata`, `generateMetadata`,
 * `robots.ts`, `sitemap.ts`). Kept in one module so every consumer resolves
 * the same absolute origin.
 *
 * Only public values live here, so the module stays importable from a client
 * component (a footer can use `SITE_NAME` without duplicating it); the origin
 * itself is validated in `libs/env/public.ts`.
 */

/** Public origin of the deployed site — set `NEXT_PUBLIC_SITE_URL` before `pnpm build`. */
export const SITE_URL = publicEnv.siteUrl;

export const SITE_NAME = "PrimeSeat";

export const DEFAULT_DESCRIPTION =
  "PrimeSeat is a movie ticket booking system — browse now showing and coming soon films, pick a showtime, choose your seats and book online in minutes.";

/** Default social-share image (served from `public/`, absolute path resolved via `metadataBase`). */
export const DEFAULT_OG_IMAGE = "/images/og-cover.png";
