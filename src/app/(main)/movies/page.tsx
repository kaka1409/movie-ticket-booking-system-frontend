import { MovieListProvider } from "@/features/movies/context";
import { getMovies } from "@/features/movies/api";
import { MOVIES_PAGE_SIZE } from "@/features/movies/constants";
import { readTabFromParams, readFiltersFromParams } from "@/features/movies/url";
import { toApiResponse } from "@/libs/api";

// Mobile
import Tabs from "./components/mobile/Tabs";
import SearchBar from "./components/mobile/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MovieGrid from "./components/mobile/MovieGrid";

// Desktop
import DesktopMovieGrid from "./components/desktop/MovieGrid";

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
  const initialFilters = readFiltersFromParams(normalizedSearchParams);

  const [nowShowingSettled, comingSoonSettled] = await Promise.allSettled([
    getMovies("now_showing", 1, MOVIES_PAGE_SIZE),
    getMovies("coming_soon", 1, MOVIES_PAGE_SIZE),
  ]);

  const nowShowing = toApiResponse(nowShowingSettled);
  const comingSoon = toApiResponse(comingSoonSettled);

  const nowShowingList = "error" in nowShowing ? [] : nowShowing.data;
  const comingSoonList = "error" in comingSoon ? [] : comingSoon.data;
  const nowShowingMeta = "error" in nowShowing ? undefined : nowShowing.meta;
  const comingSoonMeta = "error" in comingSoon ? undefined : comingSoon.meta;

  return (
    <>
      <MovieListProvider
        initialNowShowing={nowShowingList}
        initialComingSoon={comingSoonList}
        initialMeta={{ nowShowing: nowShowingMeta, comingSoon: comingSoonMeta }}
        initialTab={initialTab}
        initialFilters={initialFilters}
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
