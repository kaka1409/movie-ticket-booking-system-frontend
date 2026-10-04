export type { CastMember, Movie, FeaturedMovie } from "@/types";

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
  rating: string;
  length: string;
  format: string;
  ageRating: string;
}

/** Client-side query built from tab + search + applied filters (see api.ts). */
export interface MovieQuery {
  status?: Tab;
  search?: string;
  genres?: string[];
  rating?: string;
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
