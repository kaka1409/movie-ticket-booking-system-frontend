"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Clapperboard, Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminPoster from "@/app/(admin)/admin/components/shared/AdminPoster";

const BATCH_SIZE = 10;

export interface MovieFilterOption {
  id: string;
  title: string;
  slug: string;
  posterUrl?: string | null;
  duration?: number | null;
}

/**
 * Horizontal poster-row movie picker for the schedule board: renders first batch,
 * then loads more on scroll to bottom. `""` means every movie on the day.
 */
export default function MovieFilterGrid({
  movies,
  value,
  onChange,
}: {
  movies: MovieFilterOption[];
  value: string;
  onChange: (slug: string) => void;
}) {
  const { translate } = useLocale();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 24) {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, movies.length));
    }
  }, [hasMore, movies.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const cardClass = (selected: boolean) =>
    `flex min-w-0 items-center gap-3 rounded-xl border p-2 transition ${
      selected
        ? "border-(--color-gold) bg-(--color-gold)/10"
        : "border-(--color-border) bg-(--color-surface) hover:border-(--color-border-strong)"
    }`;

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
        {translate("admin.showtimes.movie")}
      </p>
      <div
        ref={scrollRef}
        className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 [scrollbar-width:thin]"
      >
        <button
          type="button"
          onClick={() => onChange("")}
          aria-pressed={value === ""}
          className={cardClass(value === "")}
        >
          <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-md bg-(--color-surface-2) text-(--color-text-muted)">
            <Clapperboard size={18} aria-hidden />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <span className="block truncate text-xs font-bold text-(--color-text-primary)">
              {translate("admin.common.all")}
            </span>
          </div>
        </button>
        {visibleMovies.map((movie) => (
          <button
            key={movie.slug}
            type="button"
            onClick={() => onChange(movie.slug)}
            aria-pressed={value === movie.slug}
            title={movie.title}
            className={cardClass(value === movie.slug)}
          >
            <AdminPoster
              src={movie.posterUrl}
              alt=""
              className="h-16 aspect-[3/2] rounded-md"
            />
            <div className="min-w-0 flex-1 text-left">
              <span className="block truncate text-xs font-bold text-(--color-text-primary)">
                {movie.title}
              </span>
              {movie.duration && (
                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-(--color-text-muted)">
                  <Clock size={10} />
                  <span>{movie.duration} min</span>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
