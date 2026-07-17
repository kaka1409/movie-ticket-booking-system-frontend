import type { Filters } from "./types";

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

export const AGE_RATINGS = ["P", "PG-13", "R", "NC-17"] as const;

export const RELEASE_OPTIONS = ["Any Time", "This Week", "This Month"] as const;
export const RATING_OPTIONS = ["4.5+", "4.0+", "3.5+"] as const;
export const LENGTH_OPTIONS = ["< 90 min", "90-120 min", "> 120 min"] as const;
export const FORMAT_OPTIONS = ["2D", "IMAX", "4DX"] as const;

export const DEFAULT_FILTERS: Filters = {
  releaseDate: "Any Time",
  genres: [],
  rating: "",
  length: "",
  format: "2D",
  ageRating: "",
};
