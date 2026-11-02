import type { MovieStatus } from "@/features/movies/types";

/**
 * Movie card payload from `GET /wishlist` — the exact BE shape (`status` is
 * always present, unlike the optional one on the shared `Movie`).
 */
export interface WishlistMovie {
  id: string;
  slug: string;
  title: string;
  genre: string;
  genres: string[];
  /** Live-review average (0–10); `null` while the movie has no review yet. */
  rating: number | null;
  duration: number;
  src?: string;
  posterUrl?: string;
  status: MovieStatus;
  ageRating: string;
  releaseDate: string;
}

/** One wishlist row — `GET /wishlist` returns the entry plus the movie card payload (including `status` for FE filtering). */
export interface WishlistItem {
  movieId: string;
  addedAt: string;
  movie: WishlistMovie;
}

/** Status filter tabs on the wishlist page (`all` = no filter). */
export type WishlistTab = "all" | Exclude<MovieStatus, "ended">;
