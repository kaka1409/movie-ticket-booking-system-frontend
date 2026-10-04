import type { Filters } from "./types";

/* ─── Fallback option lists ──────────────────────────────────
   Used ONLY when the catalog endpoints (/genres, /formats,
   /age-ratings) are unreachable — the filter panel must never
   render empty. Source of truth lives in the backend tables. */
export const FALLBACK_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export const FALLBACK_AGE_RATINGS = ["P", "PG-13", "R", "NC-17"] as const;
export const FALLBACK_FORMATS = ["2D", "IMAX", "4DX"] as const;

/* ─── UI-only options (labels are presentation, not data) ── */
export const RELEASE_OPTIONS = [
  { token: "today", label: "Today" },
  { token: "week", label: "This Week" },
  { token: "month", label: "This Month" },
] as const;

export const LENGTH_OPTIONS = ["< 90 min", "90-120 min", "> 120 min"] as const;

/** Rating slider bounds (backend rating scale is 0–10). */
export const RATING_MIN = 0;
export const RATING_MAX = 10;
export const RATING_STEP = 0.5;

export const MOVIES_PAGE_SIZE = 8;

export const DEFAULT_FILTERS: Filters = {
  releaseDate: "",
  genres: [],
  rating: "",
  length: "",
  format: "",
  ageRating: "",
};
