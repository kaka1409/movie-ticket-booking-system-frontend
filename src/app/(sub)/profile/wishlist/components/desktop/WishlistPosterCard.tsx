"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Ticket } from "lucide-react";
import type { WishlistMovie } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";

export default function WishlistPosterCard({
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
    <article className="group overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--color-gold)/40">
      <div className="relative">
        <Link href={`/movies/${movie.slug}`}>
          <div className="relative aspect-[2/3] w-full bg-(--color-surface-2)">
            {movie.src && (
              <Image
                src={movie.src}
                alt={movie.title}
                fill
                sizes="(min-width:1280px) 210px, (min-width:1024px) 280px, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur transition-colors hover:bg-black/80"
        >
          <Heart
            className={`h-4 w-4 ${
              liked ? "fill-pink-400 text-pink-400" : "fill-transparent text-white"
            }`}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-(--color-text-primary) transition-colors group-hover:text-(--color-gold-light)">
          {movie.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
          {movie.genre} · {movie.duration} {translate("common.min")}
        </p>

        <div className="mt-3">
          {isBookable ? (
            <Link
              href={`/booking/${movie.slug}/cinema`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-(--color-gold) py-2 text-xs font-extrabold tracking-wide text-black transition-opacity hover:opacity-90"
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
