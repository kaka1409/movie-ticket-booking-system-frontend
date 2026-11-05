export interface CastMember {
  name: string;
  role: string;
  src: string;
}

/** Release status - mirrors the backend `MovieStatus` enum (`now_showing` books, others link to detail only). */
export type MovieStatus = "now_showing" | "coming_soon" | "ended";

export interface Movie {
  id: string;
  title: string;
  slug: string;
  genre: string;
  /** Live-review average (0–10); `null` while the movie has no review yet. */
  rating: number | null;
  duration: number;
  src?: string;
  synopsis: string;
  director: string;
  cast: CastMember[];
  releaseDate: string;
  ageRating: string;
  language: string;
  /** Canonical watch page (YouTube/Vimeo); the embed URL is derived client-side. */
  trailerUrl?: string;
  /** Optional in the movie list payload; wishlist rows always carry it. */
  status?: MovieStatus;
}

export interface FeaturedMovie extends Movie {
  label: string;
  description: string;
}

export type Tab = "now_showing" | "coming_soon";

export interface MoviesMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface Filters {
  releaseDate: string;
  genres: string[];
  /** Lower rating bound as a string ("" = unbounded). */
  ratingMin: string;
  /** Upper rating bound as a string ("" = unbounded). */
  ratingMax: string;
  length: string;
  format: string;
  ageRating: string;
}

/** Client-side query built from tab + search + applied filters (see api.ts). */
export interface MovieQuery {
  status?: Tab;
  search?: string;
  genres?: string[];
  ratingMin?: number;
  ratingMax?: number;
  ageRating?: string;
  length?: string;
  format?: string;
  release?: string;
  page?: number;
  limit?: number;
}

/** Item returned by the catalog endpoints (/genres, /formats, /age-ratings). */
export interface CatalogOption {
  id: string;
  name: string;
}

/** Filter option lists fetched from the backend catalog endpoints. */
export interface FilterOptions {
  genres: CatalogOption[];
  formats: CatalogOption[];
  ageRatings: CatalogOption[];
}
