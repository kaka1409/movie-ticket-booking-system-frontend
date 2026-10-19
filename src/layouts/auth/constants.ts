import { ShieldCheck, Sparkles, Ticket } from "lucide-react";

/**
 * Artwork for the desktop auth card.
 *
 * TODO(asset): swap for the final brand key art once it lands in
 * `public/images/` (landscape 4:3 — ≥1600×1200, ≤500 KB — e.g.
 * `/images/auth-promo.jpg`). The on-brand OG cover stands in until then, and
 * replacing it stays a one-line change here.
 *
 * The artwork is an inner tile owning ~60% of the card (not full-bleed), so it
 * is read at up to ~710 CSS px wide — the larger spec keeps it crisp on a
 * retina display.
 */
export const AUTH_PROMO_IMAGE = "/images/og-cover.png";

/**
 * `next/image` `sizes` for that artwork: the `lg:` tile is 60% of the capped
 * `max-w-7xl` card (~710px), and a full-width banner in the 740–1023px band.
 */
export const AUTH_PROMO_IMAGE_SIZES = "(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw";

/** Selling points printed over the promo panel, in order (keys under `auth.promo.*`). */
export const AUTH_PROMO_BULLETS = [
  { labelKey: "auth.promo.bullet_ticket", icon: Ticket },
  { labelKey: "auth.promo.bullet_refund", icon: ShieldCheck },
  { labelKey: "auth.promo.bullet_rewards", icon: Sparkles },
] as const;
