export type AdminMovieStatus = "now_showing" | "coming_soon" | "ended";
/**
 * Featured lifecycle the admin list can filter by. Mirrors the backend
 * `FEATURED_STATES`: `flagged` = raw `isFeatured`, `active` = inside the
 * featured window (what the home block shows), `scheduled`/`expired` = the
 * window bounds the storefront never reports.
 */

export type AdminMovieFeaturedState = "flagged" | "active" | "scheduled" | "expired";


export interface AdminMovieGenre {
  id: string;
  name: string;
  nameVi: string | null;
}

/** Row-level usage counters, delivered in a parallel array by `/movies/list`. */
export interface AdminMovieCounts {
  showtimes: number;
  reviews: number;
  wishlists: number;
}

export interface AdminMovie {
  id: string;
  title: string;
  slug: string;
  status: AdminMovieStatus;
  posterUrl?: string;
  synopsis?: string;
  trailerUrl?: string | null;
  synopsisVi?: string;
  director?: string;
  language?: string;
  duration?: number;
  /** `YYYY-MM-DD` (the wire already slices the instant). */
  releaseDate?: string;
  ageRatingId?: string;
  ageRatingName?: string;
  /** Live-review average (0–10); `null` while the movie has no review yet. */
  rating: number | null;
  isFeatured: boolean;
  featuredLabel?: string;
  featuredLabelVi?: string;
  featuredDescription?: string;
  featuredDescriptionVi?: string;
  featuredFrom?: string;
  featuredTo?: string;
  featuredOrder?: number;
  genres: AdminMovieGenre[];
  counts?: AdminMovieCounts;
}

export interface AdminMovieCastItem {
  castId: string;
  name: string;
  roleName?: string;
  imageUrl?: string;
  sortOrder: number;
}

/** Admin cast member catalog entry — identity + linked-movie usage. */
export interface AdminCastMember {
  id: string;
  name: string;
  imageUrl?: string;
  movieCount: number;
}

/** Write payload for `POST`/`PATCH /movies`; cast rows have their own routes. */
export interface AdminMovieInput {
  title?: string;
  /** Only honoured on create — the slug is immutable afterwards. */
  slug?: string;
  status?: AdminMovieStatus;
  synopsis?: string;
  synopsisVi?: string;
  director?: string;
  language?: string;
  duration?: number;
  releaseDate?: string;
  ageRatingId?: string | null;
  posterUrl?: string | null;
  trailerUrl?: string | null;
  genreIds?: string[];
  isFeatured?: boolean;
  featuredLabel?: string | null;
  featuredLabelVi?: string | null;
  featuredDescription?: string | null;
  featuredDescriptionVi?: string | null;
  featuredFrom?: string | null;
  featuredTo?: string | null;
  featuredOrder?: number;
}

export interface MovieResearchCandidate {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string | null;
  synopsis: string | null;
  synopsisVi: string | null;
  director: string | null;
  language: string | null;
  duration: number | null;
  releaseDate: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  genres: string[];
  markets: string[];
  sourceUrl: string;
  aiReason: string | null;
  aiConfidence: number | null;
  status: "pending" | "rejected" | "importing" | "imported";
  importedMovieId: string | null;
  discoveredAt: string;
}

export type MovieResearchRunStatus = "running" | "paused" | "completed" | "failed" | "stopped";

export interface MovieResearchRun {
  id: string;
  status: MovieResearchRunStatus | string;
  discovered: number;
  enriched: number;
  processed: number;
  model: string | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface MovieResearchModel {
  id: string;
  name: string;
}

export interface AdminMovieCreateInput extends AdminMovieInput {
  title: string;
}

export interface AdminCastInput {
  name: string;
  roleName?: string;
  imageUrl?: string;
  sortOrder?: number;
}
