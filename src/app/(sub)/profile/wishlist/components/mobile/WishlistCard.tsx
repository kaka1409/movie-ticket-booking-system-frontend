"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Ticket } from "lucide-react";
import type { WishlistMovie } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Vertical wishlist card for the single-column mobile list. A 16:9 poster
 * banner on top links to the movie detail page; below it sit the title/meta
 * row and either the Book CTA (now-showing) or a muted "Coming Soon" label
 * (upcoming titles). Removal is delegated to the parent so it can offer an
 * Undo snackbar.
 */
export default function WishlistCard({
  movie,
  liked,
  isBookable,
  onToggleWishlist,
}: {
  movie: WishlistMovie;
  liked: boolean;
  isBookable: boolean;
  onToggleWishlist: (movie: WishlistMovie) => void;
}) {
  const { translate } = useLocale();

  return (
    <article className="overflow-hidden rounded-2xl bg-(--color-surface) shadow-(--shadow-card)">
      <div className="relative">
        <Link href={`/movies/${movie.slug}`}>
          <div className="relative aspect-video w-full bg-(--color-surface-2)">
            {movie.src && (
              <Image
                src={movie.src}
                alt={movie.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
          </div>
        </Link>

        {movie.rating !== null && (
          <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-(--radius-sm) bg-(--color-gold) px-1.5 py-0.5 text-xs font-bold text-black">
            <Star size={12} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="min-w-0 flex-1 truncate text-sm font-bold text-(--color-text-primary)">
            {movie.title}
          </h2>
          <button
            type="button"
            aria-label={
              liked
                ? translate("profile.wishlist.remove_wishlist")
                : translate("profile.wishlist.add_wishlist")
            }
            onClick={() => onToggleWishlist(movie)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-surface-2)"
          >
            <Heart
              className={`h-4 w-4 ${
                liked ? "fill-pink-400 text-pink-400" : "fill-transparent text-white"
              }`}
            />
          </button>
        </div>

        <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
          {movie.genre} • {movie.duration} {translate("booking.min")}
        </p>

        <div className="mt-3">
          {isBookable ? (
            <Link
              href={`/booking/${movie.slug}/cinema`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-(--color-gold) py-2 text-xs font-extrabold tracking-wide text-black"
            >
              <Ticket className="h-4 w-4" strokeWidth={2.2} />
              {translate("profile.wishlist.book_now")}
            </Link>
          ) : (
            <span className="flex w-full items-center justify-center rounded-xl border border-(--color-border) py-2 text-xs font-extrabold tracking-wide text-(--color-text-muted)">
              {translate("movies.coming_soon")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
