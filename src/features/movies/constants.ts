import type { Filters } from "./types";

/*  Fallback option lists
   Used ONLY when the catalog endpoints (/genres, /formats,
   /age-ratings) are unreachable the filter panel must never
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

/* UI-only options (labels are presentation, not data*/
export const RELEASE_OPTIONS = [{ token: "today" }, { token: "week" }, { token: "month" }] as const;

/** i18n keys for the release tokens above (`movies.filter_release.*`). */
export const RELEASE_LABEL_KEYS: Record<(typeof RELEASE_OPTIONS)[number]["token"], string> = {
  today: "movies.filter_release.today",
  week: "movies.filter_release.week",
  month: "movies.filter_release.month",
};

export const LENGTH_OPTIONS = ["< 90 min", "90-120 min", "> 120 min"] as const;

/**
 * i18n keys for the length buckets (`movies.filter_length.*`). The EN strings
 * stay the stored filter values (and the `LENGTH_RANGES` keys in `api.ts`)
 * only the rendered labels localize.
 */
export const LENGTH_LABEL_KEYS: Record<(typeof LENGTH_OPTIONS)[number], string> = {
  "< 90 min": "movies.filter_length.short",
  "90-120 min": "movies.filter_length.medium",
  "> 120 min": "movies.filter_length.long",
};

/** Rating range bounds (backend rating scale is 0â€“10). */
export const RATING_MIN = 0;
export const RATING_MAX = 10;
export const RATING_STEP = 0.5;

export const MOVIES_PAGE_SIZE = 8;

/** Data-cache policy for static-ish catalog reads (genres, formats, featured). */
export const REVALIDATE_60 = { next: { revalidate: 60 } } as const;

/**
 * Movie detail changes rarely and is adopted into the booking draft, so it
 * gets a much longer TTL — this is the main lever keeping `/movies/:slug`
 * hits off the backend during the booking flow.
 */
export const REVALIDATE_MOVIE_DETAIL = { next: { revalidate: 3600 } } as const;

export const RECOMMENDED_LIMIT = 8;

/** Mobile grid: 2 cot x 2 hang moi trang. */
export const RECOMMENDED_MOBILE_PAGE_SIZE = 4;

/** Desktop teaser: 1 hang 6 card o `lg:`; 2 item du chi phuc vu trang 2 mobile. */
export const RECOMMENDED_DESKTOP_COUNT = 6;

export const DEFAULT_FILTERS: Filters = {
  releaseDate: "",
  genres: [],
  ratingMin: "",
  ratingMax: "",
  length: "",
  format: "",
  ageRating: "",
};
