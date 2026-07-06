export type Tab = "now_showing" | "coming_soon";

export interface Filters {
  releaseDate: string;
  genres: string[];
  rating: string;
  length: string;
  format: string;
  ageRating: string;
}

export const DEFAULT_FILTERS: Filters = {
  releaseDate: "Any Time",
  genres: [],
  rating: "",
  length: "",
  format: "2D",
  ageRating: "",
};
