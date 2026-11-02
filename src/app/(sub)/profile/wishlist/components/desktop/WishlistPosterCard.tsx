"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Ticket, Calendar, Film, ArrowUpRight } from "lucide-react";
import type { WishlistMovie } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";

/**
 * Desktop wishlist film card:
 * High-res movie poster, IMDb rating badge, age rating tag, release date info for upcoming releases,
 * interactive wishlist toggle, and fast booking or details CTA.
 */
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
    <article className="group overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-sm transition duration-200 hover:-translate-y-1 hover:border-(--color-gold)/50 hover:shadow-lg flex flex-col justify-between">
      <div className="relative">
        <Link href={`/movies/${movie.slug}`}>
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-(--color-surface-2)">
            {movie.src ? (
              <Image
                src={movie.src}
                alt={movie.title}
                fill
                sizes="(min-width:1280px) 240px, (min-width:1024px) 280px, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-(--color-text-muted)">
                <Film size={32} />
              </div>
            )}
          </div>
        </Link>

        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          {movie.rating !== null && (
            <span className="flex items-center gap-1 rounded-md bg-(--color-gold) px-1.5 py-0.5 text-xs font-black text-black shadow-sm">
              <Star size={11} fill="currentColor" />
              {movie.rating.toFixed(1)}
            </span>
          )}
          {movie.ageRating && (
            <Badge
              variant="neutral"
              size="xs"
              className="uppercase font-bold bg-black/70 backdrop-blur-xs text-white"
            >
              {movie.ageRating}
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          aria-label={
            liked
              ? translate("profile.wishlist.remove_wishlist")
              : translate("profile.wishlist.add_wishlist")
          }
          onClick={() => onToggleWishlist(movie)}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/90 active:scale-90"
        >
          <Heart
            size={16}
            className={liked ? "fill-rose-500 text-rose-500" : "fill-transparent text-white"}
          />
        </button>
      </div>

      {/* Movie Details Footer */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/movies/${movie.slug}`}>
            <h3 className="truncate text-sm font-extrabold text-white transition-colors group-hover:text-(--color-gold)">
              {movie.title}
            </h3>
          </Link>
          <p className="mt-0.5 truncate text-xs text-(--color-text-muted)">
            {movie.genre} {movie.duration ? `· ${movie.duration} ${translate("common.min")}` : ""}
          </p>

          {!isBookable && movie.releaseDate && (
            <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-(--color-gold-light)">
              <Calendar size={12} />
              <span>
                {translate("profile.wishlist.release_date")} {movie.releaseDate}
              </span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-3 pt-2 border-t border-(--color-border)/40">
          {isBookable ? (
            <Link
              href={`/booking/${movie.slug}/cinema`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-(--color-gold) py-2 text-xs font-bold text-black transition hover:brightness-110 active:scale-95"
            >
              <Ticket size={14} />
              <span>{translate("profile.wishlist.book_now")}</span>
            </Link>
          ) : (
            <Link
              href={`/movies/${movie.slug}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) py-2 text-xs font-bold text-white transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
            >
              <span>{translate("profile.wishlist.view_details")}</span>
              <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
