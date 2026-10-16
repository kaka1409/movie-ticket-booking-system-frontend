"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Ticket } from "lucide-react";
import type { WishlistMovie } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Compact wishlist card for the 2-column mobile grid. The poster links to
 * the movie detail page; the Book CTA only renders for now-showing titles
 * (coming-soon cards link to detail only). Removal is delegated to the
 * parent so it can offer an Undo snackbar.
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
    <article className="overflow-hidden rounded-2xl bg-(--color-surface) shadow-[--shadow-card]">
      <div className="relative">
        <Link href={`/movies/${movie.slug}`}>
          <div className="relative aspect-[2/3] w-full bg-(--color-surface-2)">
            {movie.src && (
              <Image
                src={movie.src}
                alt={movie.title}
                fill
                sizes="(max-width: 740px) 50vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </Link>

        {movie.rating > 0 && (
          <span className="absolute left-2 top-2 flex items-center gap-0.5 rounded-(--radius-sm) bg-(--color-gold) px-1.5 py-0.5 text-xs font-bold text-black">
            <Star size={12} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
        )}

        <button
          type="button"
          aria-label={
            liked
              ? translate("profile.wishlist.remove_wishlist")
              : translate("profile.wishlist.add_wishlist")
          }
          onClick={() => onToggleWishlist(movie)}
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
        >
          <Heart
            className={`h-4 w-4 ${
              liked ? "fill-pink-400 text-pink-400" : "fill-transparent text-white"
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        <h2 className="truncate text-sm font-bold text-(--color-text-primary)">{movie.title}</h2>
        <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
          {movie.genre} • {movie.duration} {translate("booking.min")}
        </p>

        {isBookable && (
          <Link
            href={`/booking/${movie.slug}/cinema`}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-(--color-gold) py-2 text-xs font-extrabold tracking-wide text-black"
          >
            <Ticket className="h-4 w-4" strokeWidth={2.2} />
            {translate("profile.wishlist.book_now")}
          </Link>
        )}
      </div>
    </article>
  );
}
