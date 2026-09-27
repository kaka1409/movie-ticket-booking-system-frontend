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
