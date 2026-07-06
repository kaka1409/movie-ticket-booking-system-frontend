"use client";

import { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/contexts/MoviesContext";
import { NOW_SHOWING, COMING_SOON } from "@/features/movies/mock";
import MovieCard from "@/components/common/MovieCard";

export default function MovieGrid() {
  const { t } = useLocale();
  const {
    activeTab,
    query,
    appliedFilters,
    visibleCount,
    activeFilterCount,
    loadMore,
    clearFilters,
  } = useMovies();

  const sourceMovies = activeTab === "now_showing" ? NOW_SHOWING : COMING_SOON;

  const filtered = sourceMovies.filter((m) => {
    const q = query.toLowerCase();
    const matchesSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q);

    const matchesGenre =
      appliedFilters.genres.length === 0 ||
      appliedFilters.genres.some((g) =>
        m.genre.toLowerCase().includes(g.toLowerCase()),
      );

    const matchesRating =
      !appliedFilters.rating ||
      (appliedFilters.rating === "4.5+" && m.rating >= 4.5) ||
      (appliedFilters.rating === "4.0+" && m.rating >= 4.0) ||
      (appliedFilters.rating === "3.5+" && m.rating >= 3.5);

    const matchesLength =
      !appliedFilters.length ||
      (appliedFilters.length === "< 90 min" && m.duration < 90) ||
      (appliedFilters.length === "90-120 min" &&
        m.duration >= 90 &&
        m.duration <= 120) ||
      (appliedFilters.length === "> 120 min" && m.duration > 120);

    const matchesAge =
      !appliedFilters.ageRating || m.ageRating === appliedFilters.ageRating;

    return (
      matchesSearch && matchesGenre && matchesRating && matchesLength && matchesAge
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  /* ── Scroll to first new card after load more ── */
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

  return (
    <>
      {/* Results count */}
      {activeFilterCount > 0 && (
        <div className="px-(--space-md)">
          <p className="text-base font-bold text-white">
            {filtered.length}{" "}
            <span className="font-medium text-(--color-text-muted)">
              {t("movies.results_found")}
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
            {t("movies.no_results")}
            <br />
            {t("movies.no_results_hint")}
          </p>
          <button
            onClick={clearFilters}
            className="text-sm font-bold text-(--color-gold) underline underline-offset-2"
          >
            {t("movies.clear_filters")}
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
            {t("movies.load_more")}
          </button>
        </div>
      )}
    </>
  );
}
