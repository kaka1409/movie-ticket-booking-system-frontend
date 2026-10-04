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
import {
  readTabFromParams,
  readFiltersFromParams,
  readQueryFromParams,
} from "@/features/movies/url";
import { toApiResponse } from "@/libs/api";
import type { CatalogOption, FilterOptions } from "@/features/movies/types";

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
): CatalogOption[] {
  const result = toApiResponse(settled);
  if ("error" in result || result.data.length === 0) {
    return fallback.map((name) => ({ id: name, name }));
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

  const [moviesSettled, genresSettled, formatsSettled, ageRatingsSettled] =
    await Promise.allSettled([
      getMovies(buildMovieQuery(initialTab, initialQuery, initialFilters, 1)),
      getGenres(),
      getFormats(),
      getAgeRatings(),
    ]);

  const activeResult = toApiResponse(moviesSettled);
  const activeList = "error" in activeResult ? [] : activeResult.data;
  const activeMeta = "error" in activeResult ? undefined : activeResult.meta;

  const filterOptions: FilterOptions = {
    genres: toCatalog(genresSettled, FALLBACK_GENRES),
    formats: toCatalog(formatsSettled, FALLBACK_FORMATS),
    ageRatings: toCatalog(ageRatingsSettled, FALLBACK_AGE_RATINGS),
  };

  return (
    <>
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
