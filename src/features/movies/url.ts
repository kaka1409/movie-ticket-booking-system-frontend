import type { Tab, Filters } from "./types";

export function readFiltersFromParams(searchParams: URLSearchParams): Filters {
  const genres = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
  return {
    releaseDate: "Any Time",
    genres,
    rating: searchParams.get("rating") ?? "",
    length: "",
    format: searchParams.get("format") ?? "",
    ageRating: searchParams.get("ageRating") ?? "",
  };
}

export function readTabFromParams(searchParams: URLSearchParams): Tab {
  const status = searchParams.get("status");
  return status === "coming_soon" ? "coming_soon" : "now_showing";
}

export function writeParamsFromState(
  tab: Tab,
  filters: Filters,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("status", tab);
  if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.format) params.set("format", filters.format);
  if (filters.ageRating) params.set("ageRating", filters.ageRating);
  return params;
}
