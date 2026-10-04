"use client";

import { useRef, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import MovieCard from "@/components/ui/MovieCard";
import SectionFallback from "@/components/ui/SectionFallback";

export default function MovieGrid() {
  const { translate } = useLocale();
  const {
    activeTab,
    appliedQuery,
    movies,
    total,
    hasMore,
    isLoadingMore,
    isFetching,
    fetchError,
    activeFilterCount,
    loadMore,
    clearFilters,
    retryFetch,
  } = useMovieList();

  /* â”€â”€ Hooks must run before any early return â”€â”€ */
  const gridRef = useRef<HTMLDivElement>(null);
  const prevLoadedCountRef = useRef(movies.length);
  const prevRenderedCountRef = useRef(movies.length);
  const prevTabRef = useRef(activeTab);
  const [animThreshold, setAnimThreshold] = useState(movies.length);

  useEffect(() => {
    const tabChanged = activeTab !== prevTabRef.current;
    const loadedGrew = movies.length > prevLoadedCountRef.current;
    const renderedGrew = movies.length > prevRenderedCountRef.current;

    if (!tabChanged && loadedGrew && renderedGrew) {
      const grid = gridRef.current;
      if (grid) {
        const cards = grid.querySelectorAll<HTMLElement>("[data-movie-card]");
        const firstNew = cards[prevRenderedCountRef.current];
        if (firstNew) {
          firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      setAnimThreshold(prevRenderedCountRef.current);
    }

    prevLoadedCountRef.current = movies.length;
    prevRenderedCountRef.current = movies.length;
    prevTabRef.current = activeTab;
  }, [activeTab, movies.length]);

  const showResultsCount = activeFilterCount > 0 || appliedQuery;

  return (
    <>
      {/* Fetch failed and there is nothing to show */}
      {fetchError && movies.length === 0 && (
        <div className="px-(--space-md)">
          <SectionFallback error={fetchError} />
          <button
            type="button"
            onClick={retryFetch}
            className="mx-auto mt-2 block text-sm font-bold text-(--color-gold) underline underline-offset-2"
          >
            {translate("common.try_again")}
          </button>
        </div>
      )}

      {/* Results count (server total, not the rendered page count) */}
      {showResultsCount && !fetchError && (
        <div className="px-(--space-md)">
          <p className="text-base font-bold text-white">
            {total}{" "}
            <span className="font-medium text-(--color-text-muted)">
              {translate("movies.results_found")}
            </span>
          </p>
        </div>
      )}

      {/* Grid */}
      {movies.length > 0 ? (
        <div
          ref={gridRef}
          className={`grid grid-cols-2 gap-x-3 gap-y-6 px-(--space-md) transition-opacity ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              data-movie-card
              className={`w-full [&_a]:!w-full [&_a]:!block ${
                index >= animThreshold ? "animate-fade-in" : ""
              }`}
            >
              <MovieCard movie={movie} minLabel={translate("common.min")} />
            </div>
          ))}
        </div>
      ) : (
        !fetchError && (
          <div className="flex flex-col items-center justify-center gap-3 px-(--space-md) py-16">
            <Search size={36} className="text-(--color-border)" />
            <p className="text-center text-sm text-(--color-text-muted)">
              {translate("movies.no_results")}
              <br />
              {translate("movies.no_results_hint")}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-(--color-gold) underline underline-offset-2"
            >
              {translate("movies.clear_filters")}
            </button>
          </div>
        )
      )}

      {/* Load More â€” appends the next server page of the SAME query */}
      {hasMore && (
        <div className="px-(--space-md)">
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore || isFetching}
            className="
              w-full rounded-(--radius-lg) border border-(--color-border)
              bg-(--color-surface) py-3.5 text-sm font-bold uppercase
              tracking-widest text-(--color-gold-light)
              transition-all duration-150
              hover:border-(--color-gold)/40 hover:text-(--color-gold)
              active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isLoadingMore || isFetching
              ? translate("common.loading")
              : translate("movies.load_more")}
          </button>
        </div>
      )}
    </>
  );
}
