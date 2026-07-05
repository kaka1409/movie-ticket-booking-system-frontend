"use client";

import { useLocale } from "@/contexts/LocaleContext";
import MovieCard from "@/components/common/MovieCard";
import type { Movie } from "@/features/movies/types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const { t } = useLocale();
  return (
    <section
      className="px-(--space-md)"
      aria-labelledby={`${title.replace(/\s/g, "-").toLowerCase()}-heading`}
    >
      <div className="mb-3 pl-1 flex items-center justify-between border-l-4 border-(--color-gold) rounded-(--radius-xs)">
        <h2
          id={`${title.replace(/\s/g, "-").toLowerCase()}-heading`}
          className="text-lg font-bold text-white"
        >
          {title}
        </h2>
        <button className="text-xs font-semibold tracking-wide text-(--color-gold)">
          {t("home.movie_row.see_all")}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-(--space-sm)" role="list">
        {movies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
