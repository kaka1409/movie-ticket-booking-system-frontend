"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Ticket } from "lucide-react";
import type { Movie } from "@/features/movies/types";
import { useWishlist } from "@/features/wishlist/context";

export default function WishlistCard({ movie }: { movie: Movie }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const liked = isWishlisted(movie.id);

  return (
    <article className="relative overflow-hidden rounded-2xl bg-(--color-surface) shadow-[--shadow-card]">
      <Link href={`/movies/${movie.slug}`}>
        <div className="relative aspect-[3/4] w-full">
          {movie.src && (
            <Image
              src={movie.src}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-(--color-surface) via-(--color-surface)/85 to-transparent px-4 pb-4 pt-16">
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold tracking-wide text-(--color-text-primary)">
                {movie.genre}
              </span>
              <span className="rounded-full border border-(--color-gold)/60 px-3 py-1 text-xs font-bold tracking-wide text-(--color-gold-light)">
                {movie.ageRating}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-(--color-text-secondary)">
              {movie.title}
            </h2>

            <div className="mt-1 mb-4 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-(--color-gold) text-(--color-gold)" />
              <span className="text-sm font-semibold text-(--color-text-primary)">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Heart toggle */}
      <button
        type="button"
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(movie.id)}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm z-10"
      >
        <Heart
          className={`h-5 w-5 ${
            liked
              ? "fill-pink-400 text-pink-400"
              : "fill-transparent text-white"
          }`}
        />
      </button>

      {/* Book Now */}
      <div className="px-4 pb-4">
        <Link
          href={`/booking/${movie.slug}/cinema`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-gold) py-3.5 text-sm font-extrabold tracking-wide text-black"
        >
          <Ticket className="h-5 w-5" strokeWidth={2.2} />
          BOOK NOW
        </Link>
      </div>
    </article>
  );
}
