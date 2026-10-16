import type { MovieStatus } from "@/types";

/**
 * Movie card payload from `GET /wishlist` — the exact BE shape (`status` is
 * always present, unlike the optional one on the mock-era `Movie`).
 */
export interface WishlistMovie {
  id: string;
  slug: string;
  title: string;
  genre: string;
  genres: string[];
  rating: number;
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
