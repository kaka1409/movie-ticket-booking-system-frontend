import type {
  Movie,
  FeaturedMovie,
  MoviesMeta,
  MovieQuery,
  CatalogOption,
  Tab,
  Filters,
} from "./types";
import { apiFetch, type ApiResponse } from "@/libs/api";
import { MOVIES_PAGE_SIZE } from "./constants";
import { ALL_MOVIES } from "./mock";

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

function padDate(n: number): string {
  return String(n).padStart(2, "0");
}

function toLocalISO(date: Date): string {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`;
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
    const iso = toLocalISO(now);
    return { from: iso, to: iso };
  }

  if (release === "week") {
    const day = now.getDay(); // 0 = Sunday … 6 = Saturday
    const daysSinceMonday = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysSinceMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { from: toLocalISO(monday), to: toLocalISO(sunday) };
  }

  if (release === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: toLocalISO(first), to: toLocalISO(last) };
  }

  return null;
}

/* ─── Movies ─────────────────────────────────────────────── */

export async function getFeaturedMovies(): Promise<ApiResponse<FeaturedMovie[]>> {
  const result = await apiFetch<FeaturedMovieResponse[]>("/movies?featured=true");

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
    rating: filters.rating || undefined,
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
export async function getMovies(query: MovieQuery): Promise<ApiResponse<Movie[], MoviesMeta>> {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.genres?.length) params.set("genres", query.genres.join(","));
  if (query.rating) params.set("rating", query.rating);
  if (query.ageRating) params.set("ageRating", query.ageRating);

  const range = toDurationRange(query.length);
  if (range.min !== undefined) params.set("durationMin", String(range.min));
  if (range.max !== undefined) params.set("durationMax", String(range.max));

  if (query.format) params.set("format", query.format);

  const window = toReleaseWindow(query.release);
  if (window) {
    params.set("releaseFrom", window.from);
    params.set("releaseTo", window.to);
  }

  if (query.page) params.set("page", String(query.page));
  params.set("limit", String(query.limit ?? MOVIES_PAGE_SIZE));

  return apiFetch<Movie[], MoviesMeta>(`/movies?${params.toString()}`, {
    next: { revalidate: 60 },
  });
}

export async function getAllMovies(): Promise<Movie[]> {
  return ALL_MOVIES;
}

export async function getMovieBySlug(slug: string): Promise<Movie | undefined> {
  return ALL_MOVIES.find((movie) => movie.slug === slug);
}

export function getMovieDetail(slug: string): Promise<ApiResponse<Movie>> {
  return apiFetch<Movie>(`/movies/${encodeURIComponent(slug)}`);
}

/* ─── Catalog endpoints (filter options) ─────────────────── */

const CATALOG_CACHE = { next: { revalidate: 60 } } as const;

export async function getGenres(): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>("/genres", CATALOG_CACHE);
}

export async function getFormats(): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>("/formats", CATALOG_CACHE);
}

export async function getAgeRatings(): Promise<ApiResponse<CatalogOption[]>> {
  return apiFetch<CatalogOption[]>("/age-ratings", CATALOG_CACHE);
}
