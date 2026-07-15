"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/features/movies/context";
import MovieCard from "@/components/common/MovieCard";
import type { Movie } from "@/features/movies/types";

export default function MovieGrid({
  nowShowing,
  comingSoon,
}: {
  nowShowing: Movie[];
  comingSoon: Movie[];
}) {
  const { translate } = useLocale();
  const {
    activeTab,
    query,
    appliedFilters,
    visibleCount,
    activeFilterCount,
    loadMore,
    clearFilters,
  } = useMovies();

  const sourceMovies = activeTab === "now_showing" ? nowShowing : comingSoon;

  /* ── Hooks must run before any early return ── */
  const gridRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(visibleCount);

  useEffect(() => {
    if (visibleCount > prevCountRef.current) {
      const grid = gridRef.current;
      if (grid) {
        const cards = grid.querySelectorAll<HTMLElement>("[data-movie-card]");
        const firstNew = cards[prevCountRef.current];
        if (firstNew) {
          firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    prevCountRef.current = visibleCount;
  }, [visibleCount]);

  const filtered = sourceMovies.filter((movie) => {
    const searchQuery = query.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      movie.title.toLowerCase().includes(searchQuery) ||
      movie.genre.toLowerCase().includes(searchQuery);

    const matchesGenre =
      appliedFilters.genres.length === 0 ||
      appliedFilters.genres.some((genre) =>
        movie.genre.toLowerCase().includes(genre.toLowerCase()),
      );

    const matchesRating =
      !appliedFilters.rating ||
      (appliedFilters.rating === "4.5+" && movie.rating >= 4.5) ||
      (appliedFilters.rating === "4.0+" && movie.rating >= 4.0) ||
      (appliedFilters.rating === "3.5+" && movie.rating >= 3.5);

    const matchesLength =
      !appliedFilters.length ||
      (appliedFilters.length === "< 90 min" && movie.duration < 90) ||
      (appliedFilters.length === "90-120 min" &&
        movie.duration >= 90 &&
        movie.duration <= 120) ||
      (appliedFilters.length === "> 120 min" && movie.duration > 120);

    const matchesAge =
      !appliedFilters.ageRating || movie.ageRating === appliedFilters.ageRating;

    return (
      matchesSearch && matchesGenre && matchesRating && matchesLength && matchesAge
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <>
      {/* Results count */}
      {activeFilterCount > 0 && (
        <div className="px-(--space-md)">
          <p className="text-base font-bold text-white">
            {filtered.length}{" "}
            <span className="font-medium text-(--color-text-muted)">
              {translate("movies.results_found")}
            </span>
          </p>
        </div>
      )}

      {/* Grid */}
      {visible.length > 0 ? (
        <div ref={gridRef} className="grid grid-cols-2 gap-x-3 gap-y-6 px-(--space-md)">
          {visible.map((movie, index) => (
            <div
              key={movie.id}
              data-movie-card
              className={`w-full [&_a]:!w-full [&_a]:!block ${
                index >= prevCountRef.current ? "animate-fade-in" : ""
              }`}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-(--space-md) py-16">
          <Search size={36} className="text-(--color-border)" />
          <p className="text-center text-sm text-(--color-text-muted)">
            {translate("movies.no_results")}
            <br />
            {translate("movies.no_results_hint")}
          </p>
          <button
            onClick={clearFilters}
            className="text-sm font-bold text-(--color-gold) underline underline-offset-2"
          >
            {translate("movies.clear_filters")}
          </button>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="px-(--space-md)">
          <button
            onClick={loadMore}
            className="
              w-full rounded-(--radius-lg) border border-(--color-border)
              bg-(--color-surface) py-3.5 text-sm font-bold uppercase
              tracking-widest text-(--color-gold-light)
              transition-all duration-150
              hover:border-(--color-gold)/40 hover:text-(--color-gold)
              active:scale-[0.98]
            "
          >
            {translate("movies.load_more")}
          </button>
        </div>
      )}
    </>
  );
}
