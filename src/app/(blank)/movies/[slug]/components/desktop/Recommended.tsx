"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import MoviePosterCard from "@/components/shared/movies/MoviePosterCard";
import LocaleTransition from "@/components/ui/LocaleTransition";
import { RECOMMENDED_DESKTOP_COUNT } from "@/features/movies/constants";
import type { Movie } from "@/features/movies/types";

export default function DesktopRecommended({ movies }: { movies: Movie[] }) {
  const { translate } = useLocale();
  const visibleMovies = movies.slice(0, RECOMMENDED_DESKTOP_COUNT);
  return (
    <section className="border-t border-(--color-border) pt-10 pb-16">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-2xl font-bold text-(--color-text-primary)">
          {translate("movies.detail.you_may_like")}
        </h2>
        <Link href="/movies" className="text-sm font-semibold text-(--color-gold) hover:underline">
          {translate("movies.detail.browse_all")}
        </Link>
      </div>
      <LocaleTransition>
        <div className="grid grid-cols-3 gap-5 lg:grid-cols-6">
          {visibleMovies.map((movie) => (
            <MoviePosterCard key={movie.id} movie={movie} />
          ))}
        </div>
      </LocaleTransition>
    </section>
  );
}
