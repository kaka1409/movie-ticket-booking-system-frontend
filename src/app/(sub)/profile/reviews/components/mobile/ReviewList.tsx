"use client";

import { useState, useRef, useEffect } from "react";
import type { FilterKey } from "@/features/reviews/mock";
import type { Movie } from "@/features/movies/types";
import FilterBar from "./FilterBar";
import ReviewCard from "./ReviewCard";
import LoadMoreButton from "./LoadMoreButton";

export default function ReviewList({
  allMovies,
  filters,
}: {
  allMovies: Movie[];
  filters: readonly { key: string; label: string }[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("recent");
  const [visibleCount, setVisibleCount] = useState(8);

  const sortedMovies = [...allMovies].sort((a, b) => {
    if (activeFilter === "highest") return b.rating - a.rating;
    if (activeFilter === "lowest") return a.rating - b.rating;
    return (
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  });

  const visible = sortedMovies.slice(0, visibleCount);
  const hasMore = sortedMovies.length > visibleCount;

  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(visibleCount);

  useEffect(() => {
    if (visibleCount > prevCountRef.current) {
      const list = listRef.current;
      if (list) {
        const cards = list.querySelectorAll<HTMLElement>("[data-review-card]");
        const firstNew = cards[prevCountRef.current];
        if (firstNew) {
          firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    prevCountRef.current = visibleCount;
  }, [visibleCount]);

  const handleFilterChange = (key: FilterKey) => {
    setActiveFilter(key);
    setVisibleCount(8);
  };

  return (
    <main className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
      <FilterBar filters={filters} active={activeFilter} onChange={handleFilterChange} />

      <div ref={listRef} className="space-y-3">
        {visible.map((movie, index) => (
          <div
            key={movie.id}
            className={index >= prevCountRef.current ? "animate-fade-in" : ""}
          >
            <ReviewCard movie={movie} />
          </div>
        ))}
      </div>

      {hasMore && (
        <LoadMoreButton onClick={() => setVisibleCount((c) => c + 8)} />
      )}
    </main>
  );
}
