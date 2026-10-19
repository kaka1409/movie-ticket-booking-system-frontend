/**
 * URL ⇄ state mapping for the /movies page. Reads run once, server-side, when
 * the page renders; writes are driven by the provider via `router.replace`
 * (see AGENTS.md "Movies Page Deep Linking" for the param table).
 */
import type { Tab, Filters } from "./types";
import { RATING_MIN, RATING_MAX } from "./constants";

const RELEASE_TOKENS = ["today", "week", "month"] as const;

/** Committed search text (`q`); missing param → `""`. */
export function readQueryFromParams(searchParams: URLSearchParams): string {
  return searchParams.get("q") ?? "";
}

/**
 * One rating bound from the query string, clamped into the 0–10 scale.
 * Missing, blank or non-numeric input → `null` (the param is dropped).
 */
function readRatingBound(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(Math.max(parsed, RATING_MIN), RATING_MAX);
}

/**
 * The rating pair from the query string. A bound sitting on its edge (min `0`,
 * max `10`) is unbounded and drops out; an inverted pair is dropped entirely
 * rather than forwarded, because the API rejects it with a 400.
 */
function readRatingRange(searchParams: URLSearchParams): Pick<Filters, "ratingMin" | "ratingMax"> {
  const min = readRatingBound(searchParams.get("ratingMin"));
  const max = readRatingBound(searchParams.get("ratingMax"));

  if (min !== null && max !== null && min > max) return { ratingMin: "", ratingMax: "" };

  return {
    ratingMin: min !== null && min > RATING_MIN ? String(min) : "",
    ratingMax: max !== null && max < RATING_MAX ? String(max) : "",
  };
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
    ...readRatingRange(searchParams),
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
  if (filters.ratingMin) params.set("ratingMin", filters.ratingMin);
  if (filters.ratingMax) params.set("ratingMax", filters.ratingMax);
  if (filters.length) params.set("length", filters.length);
  if (filters.format) params.set("format", filters.format);
  if (filters.ageRating) params.set("ageRating", filters.ageRating);
  if (filters.releaseDate) params.set("release", filters.releaseDate);
  return params;
}
