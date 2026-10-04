/**
 * URL ⇄ state mapping for the /movies page. Reads run once, server-side, when
 * the page renders; writes are driven by the provider via `router.replace`
 * (see AGENTS.md "Movies Page Deep Linking" for the param table).
 */
import type { Tab, Filters } from "./types";

const RELEASE_TOKENS = ["today", "week", "month"] as const;

/** Committed search text (`q`); missing param → `""`. */
export function readQueryFromParams(searchParams: URLSearchParams): string {
  return searchParams.get("q") ?? "";
}

/**
 * Committed filters from the query string. Unknown values are dropped
 * defensively (e.g. `release` outside `RELEASE_TOKENS`, empty genre tokens)
 * so a hand-edited URL can never feed invalid params to the API.
 */
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

/** Active tab from `status`; anything except `coming_soon` falls back to `now_showing`. */
export function readTabFromParams(searchParams: URLSearchParams): Tab {
  const status = searchParams.get("status");
  return status === "coming_soon" ? "coming_soon" : "now_showing";
}

/**
 * Serialize provider state back into the query string. Empty values are
 * omitted (except `status`) so shared URLs stay minimal and readable.
 */
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
