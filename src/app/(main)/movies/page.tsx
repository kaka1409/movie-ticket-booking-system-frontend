"use client";

import { Suspense } from "react";
import { MoviesProvider } from "@/contexts/MoviesContext";
import Tabs from "./components/mobile/Tabs";
import SearchBar from "./components/mobile/SearchBar";
import FilterPanel from "./components/mobile/FilterPanel";
import MovieGrid from "./components/mobile/MovieGrid";
import DesktopMovieGrid from "./components/desktop/MovieGrid";

export default function MoviesPage() {
  return (
    <Suspense fallback={null}>
      <MoviesProvider>
        <>
          <div className="block md:hidden">
            <div className="space-y-4 py-(--space-md)">
              <Tabs />
              <SearchBar />
              <FilterPanel />
              <MovieGrid />
            </div>
          </div>

          <div className="hidden md:block">
            <DesktopMovieGrid />
          </div>
        </>
      </MoviesProvider>
    </Suspense>
  );
}
