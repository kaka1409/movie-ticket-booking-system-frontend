"use client";

import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieList } from "@/features/movies/context";
import { useAppendReveal } from "@/hooks/useAppendReveal";
import Button from "@/components/ui/Button";
import SectionFallback from "@/components/ui/SectionFallback";
import MovieCard from "./MovieCard";

/**
 * Skeleton bar for the loading grid. `ui/Skeleton` paints `--color-surface-2`,
 * which is exactly the colour the panel's `surface-raised` scope gives every
 * card in here — the bars would vanish into their own card. A muted tint stays
 * readable on both the lifted card and the panel behind it.
 */
function SkeletonBar({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`animate-pulse bg-(--color-text-muted)/30 ${className}`} style={style} />;
}

/**
 * Desktop movies grid: 3 columns, 4 from `xl:`. "Bookable" is the ACTIVE TAB,
 * not `movie.status` — a Coming Soon row can never offer a CTA whatever the
 * payload says. Both trees run `useAppendReveal`; the hidden one is a no-op.
 */
export default function MovieGrid() {
  const { translate } = useLocale();
  const {
    activeTab,
    movies,
    hasMore,
    isLoadingMore,
    isFetching,
    fetchError,
    loadMore,
    clearFilters,
    retryFetch,
  } = useMovieList();

  /* Hooks must run before any early return */
  const { containerRef: gridRef, animThreshold } = useAppendReveal<HTMLDivElement>({
    count: movies.length,
    cardSelector: "[data-movie-card]",
    swapKey: activeTab,
  });

  const isBookable = activeTab === "now_showing";

  if (fetchError && movies.length === 0) {
    return (
      <>
        <SectionFallback error={fetchError} />
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={retryFetch}
            className="text-sm font-bold text-(--color-gold) underline underline-offset-2"
          >
            {translate("common.try_again")}
          </button>
        </div>
      </>
    );
  }

  if (movies.length === 0 && isFetching) {
    return (
      <div className="grid grid-cols-3 gap-6 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
          >
            <SkeletonBar className="w-full" style={{ aspectRatio: "2/3" }} />
            <div className="p-4">
              <SkeletonBar className="h-3.5 w-3/4 rounded-full" />
              <SkeletonBar className="mt-2 h-3 w-1/2 rounded-full" />
              <SkeletonBar className="mt-4 h-8 w-full rounded-(--radius-sm)" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* No card of its own: this renders inside the movie panel, which is already
     the bounded surface (the mobile grid has no box either). */
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-20">
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
    );
  }

  return (
    <>
      <div
        ref={gridRef}
        className={`grid grid-cols-3 gap-6 transition-opacity xl:grid-cols-4 ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            data-movie-card
            className={index >= animThreshold ? "animate-fade-in" : ""}
          >
            <MovieCard movie={movie} isBookable={isBookable} />
          </div>
        ))}
      </div>

      {/* Next server page of the same query */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="loadMore"
            size="md"
            fullWidth={false}
            className="w-full max-w-sm"
            onClick={loadMore}
            disabled={isLoadingMore || isFetching}
          >
            {isLoadingMore || isFetching
              ? translate("common.loading")
              : translate("movies.load_more")}
          </Button>
        </div>
      )}
    </>
  );
}
