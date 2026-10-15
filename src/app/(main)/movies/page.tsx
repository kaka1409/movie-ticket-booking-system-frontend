import { MovieListProvider } from "@/features/movies/context";
import {
  buildMovieQuery,
  getMovies,
  getGenres,
  getFormats,
  getAgeRatings,
} from "@/features/movies/api";
import {
  FALLBACK_GENRES,
  FALLBACK_FORMATS,
  FALLBACK_AGE_RATINGS,
} from "@/features/movies/constants";
import enMessages from "@/locales/en.json";
import vnMessages from "@/locales/vn.json";
import {
  readTabFromParams,
  readFiltersFromParams,
  readQueryFromParams,
} from "@/features/movies/url";
import { toApiResponse } from "@/libs/api";
import { getRequestLocale } from "@/libs/session";
import type { CatalogOption, FilterOptions } from "@/features/movies/types";
import type { Metadata } from "next";
import { SITE_URL } from "@/libs/site";

export const metadata: Metadata = {
  title: "Now Showing & Coming Soon Movies",
  description:
    "Browse now showing and coming soon movies, search by title and filter by genre, format, rating and release date.",
  alternates: { canonical: "/movies" },
};

// Mobile
import Tabs from "./components/mobile/Tabs";
import SearchBar from "./components/mobile/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MovieGrid from "./components/mobile/MovieGrid";

// Desktop
import DesktopMovieGrid from "./components/desktop/MovieGrid";

function toCatalog(
  settled: PromiseSettledResult<Awaited<ReturnType<typeof getGenres>>>,
  fallback: readonly string[],
  labelOf: (name: string) => string = (name) => name,
): CatalogOption[] {
  const result = toApiResponse(settled);
  if ("error" in result || result.data.length === 0) {
    return fallback.map((name) => ({ id: name, name: labelOf(name) }));
  }
  return result.data;
}

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
  const initialTab = readTabFromParams(normalizedSearchParams);
  const initialQuery = readQueryFromParams(normalizedSearchParams);
  const initialFilters = readFiltersFromParams(normalizedSearchParams);
  // See home/page.tsx: the locale cookie forces per-request rendering; the
  // fetch cache (keyed per ?lang= URL) still shields the backend.
  const locale = await getRequestLocale();

  const [moviesSettled, genresSettled, formatsSettled, ageRatingsSettled] =
    await Promise.allSettled([
      getMovies(buildMovieQuery(initialTab, initialQuery, initialFilters, 1), locale),
      getGenres(locale),
      getFormats(locale),
      getAgeRatings(locale),
    ]);

  const activeResult = toApiResponse(moviesSettled);
  const activeList = "error" in activeResult ? [] : activeResult.data;
  const activeMeta = "error" in activeResult ? undefined : activeResult.meta;

  const genreLabels = (locale === "vn" ? vnMessages : enMessages).movies.genre_name as Record<
    string,
    string
  >;
  // Canonical "Sci-Fi" → `genre_name.scifi`, "Action" → `genre_name.action`.
  const genreLabelOf = (name: string): string =>
    genreLabels[name.toLowerCase().replace(/[^a-z]/g, "")] ?? name;
  const filterOptions: FilterOptions = {
    genres: toCatalog(genresSettled, FALLBACK_GENRES, genreLabelOf),
    formats: toCatalog(formatsSettled, FALLBACK_FORMATS),
    ageRatings: toCatalog(ageRatingsSettled, FALLBACK_AGE_RATINGS),
  };

  // Build ItemList structured data for SEO
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: activeList.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/movies/${movie.slug}`,
      name: movie.title,
      image: movie.src,
      datePublished: movie.releaseDate,
    })),
  };

  return (
    <>
      {/* JSON-LD structured data for search engines (ItemList of movies). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <MovieListProvider
        initialMovies={activeList}
        initialMeta={activeMeta}
        initialTab={initialTab}
        initialQuery={initialQuery}
        initialFilters={initialFilters}
        initialFilterOptions={filterOptions}
      >
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs />
            <SearchBar />
            <FilterPanel />
            <MovieGrid />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopMovieGrid />
        </div>
      </MovieListProvider>
    </>
  );
}
