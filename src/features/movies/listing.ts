import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import { settleApiResponse } from "@/libs/api";
import type { ErrorResponse } from "@/libs/api";
import { buildMovieQuery, getAgeRatings, getFormats, getGenres, getMovies } from "./api";
import { FALLBACK_AGE_RATINGS, FALLBACK_FORMATS, FALLBACK_GENRES } from "./constants";
import type { CatalogOption, FilterOptions, Filters, Movie, MoviesMeta, Tab } from "./types";

/** Everything the movies page renders, resolved in one parallel round trip. */
export interface MoviesListingData {
  movies: Movie[];
  meta?: MoviesMeta;
  error: ErrorResponse["error"] | null;
  filterOptions: FilterOptions;
}

function toCatalog(
  result: { data: CatalogOption[] } | { error: ErrorResponse["error"] },
  fallback: readonly string[],
  labelOf: (name: string) => string = (name) => name,
): CatalogOption[] {
  if ("error" in result || result.data.length === 0) {
    return fallback.map((name) => ({ id: name, name: labelOf(name) }));
  }
  return result.data;
}

/**
 * Row list + the three filter catalogs. All four are independent reads, so they
 * go out together; a failed catalog falls back to the static option list rather
 * than emptying the filter panel.
 */
export async function getMoviesListing(
  tab: Tab,
  query: string,
  filters: Filters,
  locale: "en" | "vn",
): Promise<MoviesListingData> {
  const [movies, genres, formats, ageRatings] = await Promise.all([
    settleApiResponse(getMovies(buildMovieQuery(tab, query, filters, 1), locale)),
    settleApiResponse(getGenres(locale)),
    settleApiResponse(getFormats(locale)),
    settleApiResponse(getAgeRatings(locale)),
  ]);

  const genreLabels = (locale === "vn" ? vnMessages : enMessages).movies.genre_name as Record<
    string,
    string
  >;
  // Canonical "Sci-Fi" → `genre_name.scifi`, "Action" → `genre_name.action`.
  const genreLabelOf = (name: string): string =>
    genreLabels[name.toLowerCase().replace(/[^a-z]/g, "")] ?? name;

  return {
    movies: "error" in movies ? [] : movies.data,
    meta: "error" in movies ? undefined : movies.meta,
    error: "error" in movies ? movies.error : null,
    filterOptions: {
      genres: toCatalog(genres, FALLBACK_GENRES, genreLabelOf),
      formats: toCatalog(formats, FALLBACK_FORMATS),
      ageRatings: toCatalog(ageRatings, FALLBACK_AGE_RATINGS),
    },
  };
}
