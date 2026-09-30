import { useMemo } from "react";
import type { Movie } from "@/features/movies/types";
import type { Filters } from "@/features/movies/types";

export function useMovieFilters(
  movies: Movie[],
  query: string,
  filters: Filters
) {
  return useMemo(() => {
    const searchQuery = query.toLowerCase();

    return movies.filter((movie) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        movie.title.toLowerCase().includes(searchQuery) ||
        movie.genre.toLowerCase().includes(searchQuery);

      // Genre filter
      const matchesGenre =
        filters.genres.length === 0 ||
        filters.genres.some((genre) =>
          movie.genre.toLowerCase().includes(genre.toLowerCase())
        );

      // Rating filter
      const matchesRating =
        !filters.rating ||
        (filters.rating === "4.5+" && movie.rating >= 4.5) ||
        (filters.rating === "4.0+" && movie.rating >= 4.0) ||
        (filters.rating === "3.5+" && movie.rating >= 3.5);

      // Length filter
      const matchesLength =
        !filters.length ||
        (filters.length === "< 90 min" && movie.duration < 90) ||
        (filters.length === "90-120 min" &&
          movie.duration >= 90 &&
          movie.duration <= 120) ||
        (filters.length === "> 120 min" && movie.duration > 120);

      // Age rating filter
      const matchesAge =
        !filters.ageRating || movie.ageRating === filters.ageRating;

      return (
        matchesSearch && matchesGenre && matchesRating && matchesLength && matchesAge
      );
    });
  }, [movies, query, filters]);
}
