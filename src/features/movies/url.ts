import type { Tab, Filters } from "./types";

const RELEASE_TOKENS = ["today", "week", "month"] as const;

export function readQueryFromParams(searchParams: URLSearchParams): string {
  return searchParams.get("q") ?? "";
}

export function readFiltersFromParams(searchParams: URLSearchParams): Filters {
  const genres = searchParams.get("genres")?.split(",").filter(Boolean) ?? [];
  const release = searchParams.get("release") ?? "";
  return {
    releaseDate: (RELEASE_TOKENS as readonly string[]).includes(release) ? release : "",
    genres,
    rating: searchParams.get("rating") ?? "",
    length: searchParams.get("length") ?? "",
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
  query: string = "",
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("status", tab);
  if (query) params.set("q", query);
  if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
  if (filters.rating) params.set("rating", filters.rating);
  if (filters.length) params.set("length", filters.length);
  if (filters.format) params.set("format", filters.format);
  if (filters.ageRating) params.set("ageRating", filters.ageRating);
  if (filters.releaseDate) params.set("release", filters.releaseDate);
  return params;
}
