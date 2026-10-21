import type {
  Movie,
  FeaturedMovie,
  MoviesMeta,
  MovieQuery,
  CatalogOption,
  Tab,
  Filters,
} from "./types";
import { apiFetch, withLang, type ApiResponse } from "@/libs/api";
import { formatDateOnly } from "@/libs/date";
import { MOVIES_PAGE_SIZE } from "./constants";

type FeaturedMovieResponse = Movie & {
  featuredLabel?: string;
  featuredDescription?: string;
};

/* ─── Query mappers (UI labels → API params) ─────────────── */

/** Length bucket labels → inclusive minute bounds. */
const LENGTH_RANGES: Record<string, { min?: number; max?: number }> = {
  "< 90 min": { max: 89 },
  "90-120 min": { min: 90, max: 120 },
  "> 120 min": { min: 121 },
};

function toDurationRange(length?: string): { min?: number; max?: number } {
  if (!length) return {};
  return LENGTH_RANGES[length] ?? {};
}

/**
 * Release window tokens → inclusive YYYY-MM-DD bounds computed in local time.
 * - "today" → the current calendar day
 * - "week"  → Monday … Sunday of the week containing today
 * - "month" → 1st … last day of the month containing today
 */
function toReleaseWindow(release?: string): { from: string; to: string } | null {
  if (!release) return null;
  const now = new Date();

  if (release === "today") {
    const iso = formatDateOnly(now);
    return { from: iso, to: iso };
  }

  if (release === "week") {
    const day = now.getDay(); // 0 = Sunday … 6 = Saturday
    const daysSinceMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: formatDateOnly(monday), to: formatDateOnly(sunday) };
  }

  if (release === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: formatDateOnly(first), to: formatDateOnly(last) };
  }

  return null;
}

/* ─── Movies ─────────────────────────────────────────────── */

/** Data-cache policy for static-ish catalog reads (genres, formats, featured). */
export const REVALIDATE_60 = { next: { revalidate: 60 } } as const;

/**
 * Movie detail changes rarely and is adopted into the booking draft, so it
 * gets a much longer TTL — this is the main lever keeping `/movies/:slug`
 * hits off the backend during the booking flow.
 */
export const REVALIDATE_MOVIE_DETAIL = { next: { revalidate: 3600 } } as const;

export async function getFeaturedMovies(
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<FeaturedMovie[]>> {
  const result = await apiFetch<FeaturedMovieResponse[]>(
    withLang("/movies?featured=true", locale),
    REVALIDATE_60,
  );

  if ("error" in result) {
    return { error: result.error };
  }

  return {
    data: result.data.map(({ featuredLabel, featuredDescription, ...movie }) => ({
      ...movie,
      label: featuredLabel ?? "",
      description: featuredDescription ?? "",
    })),
  };
}

/**
 * Build the API query from tab + committed search + committed filters.
 * Shared by the SSR page (initial load) and the client context refetches.
 */
export function buildMovieQuery(
  status: Tab,
  search: string,
  filters: Filters,
  page: number,
): MovieQuery {
  return {
    status,
    search: search || undefined,
    genres: filters.genres.length > 0 ? filters.genres : undefined,
    ratingMin: filters.ratingMin ? Number(filters.ratingMin) : undefined,
    ratingMax: filters.ratingMax ? Number(filters.ratingMax) : undefined,
    ageRating: filters.ageRating || undefined,
    length: filters.length || undefined,
    format: filters.format || undefined,
    release: filters.releaseDate || undefined,
    page,
    limit: MOVIES_PAGE_SIZE,
  };
}

/**
 * Paginated movie list shared by home rows and the /movies grid.
 * Accepts the full query (search + filters) and maps UI labels to API params.
 */
export async function getMovies(
  query: MovieQuery,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<Movie[], MoviesMeta>> {
  const params = new URLSearchParams();
  params.set("lang", locale);

  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.genres?.length) params.set("genres", query.genres.join(","));
  if (query.ratingMin !== undefined) params.set("ratingMin", String(query.ratingMin));
  if (query.ratingMax !== undefined) params.set("ratingMax", String(query.ratingMax));
  if (query.ageRating) params.set("ageRating", query.ageRating);

  const range = toDurationRange(query.length);
  if (range.min !== undefined) params.set("durationMin", String(range.min));
  if (range.max !== undefined) params.set("durationMax", String(range.max));

  if (query.format) params.set("format", query.format);

  const releaseWindow = toReleaseWindow(query.release);
  if (releaseWindow) {
    params.set("releaseFrom", releaseWindow.from);
    params.set("releaseTo", releaseWindow.to);
  }

  if (query.page) params.set("page", String(query.page));
  params.set("limit", String(query.limit ?? MOVIES_PAGE_SIZE));

  return apiFetch<Movie[], MoviesMeta>(`/movies?${params.toString()}`, {
    next: { revalidate: 60 },
  });
}

/** LIVE — `GET /movies/:slug` returning the union (`{ data }` or `{ error }`). */
export function getMovieDetail(
  slug: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<Movie>> {
  return apiFetch<Movie>(
    withLang(`/movies/${encodeURIComponent(slug)}`, locale),
    REVALIDATE_MOVIE_DETAIL,
  );
}

/* ─── Catalog endpoints (filter options) ─────────────────── */

/** Genre catalog; callers fall back to `FALLBACK_GENRES` on an error union. */
export async function getGenres(locale: "en" | "vn" = "en"): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>(withLang("/genres", locale), REVALIDATE_60);
}

/** Format catalog; callers fall back to `FALLBACK_FORMATS` on an error union. */
export async function getFormats(
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>(withLang("/formats", locale), REVALIDATE_60);
}

/** Age-rating catalog; callers fall back to `FALLBACK_AGE_RATINGS` on an error union. */
export async function getAgeRatings(
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>(withLang("/age-ratings", locale), REVALIDATE_60);
}
