"use client";

import MovieCard from "@/components/common/MovieCard";
import { NOW_SHOWING, COMING_SOON } from "@/features/movies/mock";

export default function MoviesPage() {
  return (
    <div className="px-4 py-6 space-y-8">
      <section>
        <h2 className="text-lg font-bold text-(--color-gold) mb-4">Now Showing</h2>
        <div className="flex flex-wrap gap-4">
          {NOW_SHOWING.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-(--color-gold) mb-4">Coming Soon</h2>
        <div className="flex flex-wrap gap-4">
          {COMING_SOON.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
