import type { Metadata } from "next";
import {
  readFiltersFromParams,
  readQueryFromParams,
  readTabFromParams,
} from "@/features/movies/utils/url";
import { getRequestLocale } from "@/libs/session";
import {
  buildMovieQuery,
  getAgeRatings,
  getFormats,
  getGenres,
  getMovies,
} from "@/features/movies/api";
import { getFallbackFilterOptions } from "@/features/movies/utils/filterOptions";
import { MoviesPageSections } from "./sections";

export const metadata: Metadata = {
  title: "Now Showing & Coming Soon Movies",
  description:
    "Browse now showing and coming soon movies, search by title and filter by genre, format, rating and release date.",
  alternates: { canonical: "/movies" },
};

/**
 * The movie rows initialize the list provider; each independent filter catalog
 * streams into the mounted provider behind its own boundary.
 */
export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const normalizedSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") normalizedSearchParams.set(key, value);
  }
  // See home/page.tsx: the locale cookie forces per-request rendering; the
  // fetch cache (keyed per ?lang= URL) still shields the backend.
  const locale = await getRequestLocale();
  const tab = readTabFromParams(normalizedSearchParams);
  const query = readQueryFromParams(normalizedSearchParams);
  const filters = readFiltersFromParams(normalizedSearchParams);
  const moviesPromise = getMovies(buildMovieQuery(tab, query, filters, 1), locale);
  const genresPromise = getGenres(locale);
  const formatsPromise = getFormats(locale);
  const ageRatingsPromise = getAgeRatings(locale);

  return (
    <MoviesPageSections
      tab={tab}
      query={query}
      filters={filters}
      locale={locale}
      moviesPromise={moviesPromise}
      genresPromise={genresPromise}
      formatsPromise={formatsPromise}
      ageRatingsPromise={ageRatingsPromise}
      initialFilterOptions={getFallbackFilterOptions(locale)}
    />
  );
}
