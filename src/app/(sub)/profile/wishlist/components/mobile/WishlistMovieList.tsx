"use client";

import { useWishlist } from "@/features/wishlist/context";
import type { Movie } from "@/features/movies/types";
import WishlistCard from "./WishlistCard";
import EmptyState from "./EmptyState";

export default function WishlistMovieList({ allMovies }: { allMovies: Movie[] }) {
  const { wishlist } = useWishlist();

  const movies = wishlist
    .map((id) => allMovies.find((m) => m.id === id))
    .filter(Boolean);

  if (movies.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pb-24 pt-4 px-4 space-y-4">
      {movies.map((movie) => (
        <WishlistCard key={movie!.id} movie={movie!} />
      ))}
    </main>
  );
}
