// import { Suspense } from "react";
import { MoviesProvider } from "@/features/movies/context";
import {
  getNowShowingMovies,
  getComingSoonMovies,
} from "@/features/movies/api";
import { toApiResult } from "@/libs/api";

// Mobile
import Tabs from "./components/mobile/Tabs";
import SearchBar from "./components/mobile/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MovieGrid from "./components/mobile/MovieGrid";

// Desktop
import DesktopMovieGrid from "./components/desktop/MovieGrid";

export default async function MoviesPage() {
  const [nowShowingSettled, comingSoonSettled] = await Promise.allSettled([
    getNowShowingMovies(),
    getComingSoonMovies(),
  ]);

  const nowShowing = toApiResult(nowShowingSettled);
  const comingSoon = toApiResult(comingSoonSettled);

  return (
    <>
      <MoviesProvider>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs />
            <SearchBar />
            <FilterPanel />
            <MovieGrid
              nowShowing={nowShowing.data ?? []}
              comingSoon={comingSoon.data ?? []}
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <DesktopMovieGrid />
        </div>
      </MoviesProvider>
    </>
  );
}
