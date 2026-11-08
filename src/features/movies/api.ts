import { cache } from "react";
import type {
  Movie,
  FeaturedMovie,
  MoviesMeta,
  MovieQuery,
  CatalogOption,
  Tab,
  Filters,
} from "./types";
import { apiFetch, settleApiResponse, withLang, type ApiResponse } from "@/libs/api";
import {
  MOVIES_PAGE_SIZE,
  RECOMMENDED_LIMIT,
  REVALIDATE_60,
  REVALIDATE_MOVIE_DETAIL,
} from "./constants";
import { toDurationRange, toReleaseWindow } from "./utils/query";

type FeaturedMovieResponse = Movie & {
  featuredLabel?: string;
  featuredDescription?: string;
};

/* ─── Movies ─────────────────────────────────────────────── */

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

export async function getRelatedMovies(
  slug: string,
  locale: "en" | "vn" = "en",
  limit: number = 6,
): Promise<ApiResponse<Movie[]>> {
  return apiFetch<Movie[]>(
    withLang(`/movies/${encodeURIComponent(slug)}/related?limit=${limit}`, locale),
    REVALIDATE_60,
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

/** Shared cached feeds used by independent home-page sections. */
export const getHomeFeaturedMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getFeaturedMovies(locale)),
);

export const getHomeNowShowingMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getMovies({ status: "now_showing", page: 1, limit: MOVIES_PAGE_SIZE }, locale)),
);

export const getHomeComingSoonMovies = cache((locale: "en" | "vn") =>
  settleApiResponse(getMovies({ status: "coming_soon", page: 1, limit: MOVIES_PAGE_SIZE }, locale)),
);

/** Cached related-movies feed shared by the mobile and desktop detail sections. */
export const getMovieRecommendations = cache((movieSlug: string, locale: "en" | "vn") =>
  settleApiResponse(getRelatedMovies(movieSlug, locale, RECOMMENDED_LIMIT)),
);
