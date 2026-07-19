import { Suspense } from "react";
import { MoviesProvider } from "@/features/movies/context";
import {
  getNowShowingMovies,
  getComingSoonMovies,
} from "@/features/movies/api";

// Mobile
import Tabs from "./components/mobile/Tabs";
import SearchBar from "./components/mobile/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MovieGrid from "./components/mobile/MovieGrid";
import MoviesSkeleton from "./components/mobile/MoviesSkeleton";

// Desktop
import DesktopMovieGrid from "./components/desktop/MovieGrid";

export default async function MoviesPage() {
  const [nowShowing, comingSoon] = await Promise.all([
    getNowShowingMovies(),
    getComingSoonMovies(),
  ]);

  return (
    <>
      <MoviesProvider>
        {/* Mobile */}
        <div className="block md:hidden">
          <div className="space-y-4 py-(--space-md)">
            <Tabs />
            <SearchBar />
            <FilterPanel />
            <MovieGrid nowShowing={nowShowing} comingSoon={comingSoon} />
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
