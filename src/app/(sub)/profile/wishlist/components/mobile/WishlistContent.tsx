"use client";

import { ALL_MOVIES } from "@/features/movies/mock";
import { useWishlist } from "@/contexts/WishlistContext";
import WishlistCard from "./WishlistCard";
import EmptyState from "./EmptyState";

export default function WishlistContent() {
  const { wishlist } = useWishlist();

  const movies = wishlist
    .map((id) => ALL_MOVIES.find((m) => m.id === id))
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
