"use client";

import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import MovieCard from "@/components/ui/MovieCard";
import SectionFallback from "@/components/ui/SectionFallback";
import { Skeleton } from "@/components/ui/Skeleton";

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

  /* Hooks must run before any early return*/
  const { containerRef: gridRef, animThreshold } = useAppendReveal<HTMLDivElement>({
    count: movies.length,
    cardSelector: "[data-movie-card]",
    swapKey: activeTab,
  });

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
              className={`w-full ${index >= animThreshold ? "animate-fade-in" : ""}`}
            >
              <MovieCard
                movie={movie}
                isFluid
                minLabel={translate("common.min")}
                sizes="(max-width: 767px) calc(50vw - 22px), 130px"
              />
            </div>
          ))}
        </div>
      ) : isFetching ? (
        /* First load of a tab / new query: skeletons, never the "no results"
           panel (the list is briefly empty before the page-1 fetch lands). */
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 px-(--space-md)">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full rounded-(--radius-lg)" style={{ aspectRatio: "2/3" }} />
              <Skeleton className="mt-2 h-3.5 w-3/4 rounded-full" />
              <Skeleton className="mt-1 h-2.5 w-1/2 rounded-full" />
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

      {/* Load More — appends the next server page of the SAME query */}
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
              transition duration-150
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
