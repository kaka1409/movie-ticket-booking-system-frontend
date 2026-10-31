import type { Movie } from "@/features/movies/types";

/* ─── Payment Types ──────────────────────────────────────── */

/**
 * Payment method ids are opaque wire values owned by the backend catalog
 * (`GET /payment-methods`): the app never hardcodes the list, so adding a
 * method server-side needs no FE change.
 */
export type PaymentMethodId = string;

/**
 * Slim movie snapshot adopted at the cinema step — the only movie data the
 * downstream OrderSummary panels need, so credentials/payment stop refetching
 * `GET /movies/:slug` on every entry (see the booking movie-adopt flow).
 */
export type BookingMovie = Pick<
  Movie,
  "slug" | "title" | "src" | "genre" | "duration" | "ageRating"
>;
