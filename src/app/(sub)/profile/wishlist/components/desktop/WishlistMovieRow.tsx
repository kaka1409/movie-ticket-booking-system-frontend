"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Ticket, Calendar, Film, ArrowUpRight, Clock } from "lucide-react";
import type { WishlistMovie } from "@/features/wishlist/types";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import RatingBadge from "@/components/ui/RatingBadge";

/**
 * Desktop horizontal wishlist movie card:
 * Displays movie poster, title, age rating, duration, release info,
 * rating badge, and action CTAs matching the ReviewRow visual format.
 */
export default function WishlistMovieRow({
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
  const posterSource = movie.src || movie.posterUrl;

  return (
    <article
      data-wishlist-card
      className="group flex flex-col gap-5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card) transition duration-200 hover:border-(--color-gold)/40 hover:shadow-lg sm:flex-row sm:items-center"
    >
      {/* 1. Movie Poster */}
      <Link
        href={`/movies/${movie.slug}`}
        className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2) shadow-sm lg:w-28"
      >
        {posterSource ? (
          <Image
            src={posterSource}
            alt={movie.title}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-(--color-text-muted)">
            <Film size={28} />
          </div>
        )}

        {/* Age Rating Badge Over Poster */}
        {movie.ageRating && (
          <div className="absolute left-1.5 top-1.5">
            <Badge
              variant="neutral"
              size="xs"
              className="bg-black/75 font-black uppercase text-white backdrop-blur-xs"
            >
              {movie.ageRating}
            </Badge>
          </div>
        )}
      </Link>

      {/* 2. Middle Movie Metadata */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={`/movies/${movie.slug}`}>
              <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-(--color-gold) lg:text-lg">
                {movie.title}
              </h3>
            </Link>

            {isBookable ? (
              <Badge variant="gold" size="xs" className="font-extrabold uppercase">
                {translate("profile.wishlist.ready_to_watch")}
              </Badge>
            ) : (
              <Badge
                variant="neutral"
                size="xs"
                className="font-bold uppercase text-(--color-text-muted)"
              >
                {translate("profile.wishlist.coming_soon_count")}
              </Badge>
            )}
          </div>

          {/* Details Row: Genre, Duration, Rating */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-(--color-text-muted)">
            <span className="text-white">{movie.genre}</span>

            {movie.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-(--color-gold)" />
                {movie.duration} {translate("common.min")}
              </span>
            )}

            {movie.rating !== null && (
              <div className="flex items-center gap-1.5 rounded-lg border border-(--color-border) bg-(--color-surface-2)/80 px-2.5 py-0.5">
                <RatingBadge rating={movie.rating} size={12} />
              </div>
            )}
          </div>

          {/* Release Date Info for Upcoming Movies */}
          {!isBookable && movie.releaseDate && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-(--color-gold-light)">
              <Calendar size={13} />
              <span>
                {translate("profile.wishlist.release_date")}: {movie.releaseDate}
              </span>
            </p>
          )}
        </div>

        {/* Action Link to Details */}
        <div>
          <Link
            href={`/movies/${movie.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-(--color-gold) transition hover:underline underline-offset-2"
          >
            <span>{translate("profile.wishlist.view_details")}</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* 3. Right Action Column */}
      <div className="flex shrink-0 flex-row items-center gap-2.5 border-t border-(--color-border)/50 pt-3 sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
        {/* Book Now or View Details CTA */}
        {isBookable ? (
          <Link
            href={`/booking/${movie.slug}/cinema`}
            className="flex items-center justify-center gap-2 rounded-xl bg-(--color-gold) px-5 py-2.5 text-xs font-bold text-black shadow-sm transition hover:brightness-110 active:scale-95"
          >
            <Ticket size={15} />
            <span>{translate("profile.wishlist.book_now")}</span>
          </Link>
        ) : (
          <Link
            href={`/movies/${movie.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-4 py-2.5 text-xs font-bold text-white transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
          >
            <span>{translate("profile.wishlist.view_details")}</span>
            <ArrowUpRight size={14} />
          </Link>
        )}

        {/* Remove from Wishlist Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(movie)}
          aria-label={
            liked
              ? translate("profile.wishlist.remove_wishlist")
              : translate("profile.wishlist.add_wishlist")
          }
          className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-semibold text-(--color-text-muted) transition hover:border-rose-500/50 hover:text-rose-400 active:scale-95"
        >
          <Heart
            size={14}
            className={liked ? "fill-rose-500 text-rose-500" : "fill-transparent text-white"}
          />
          <span className="text-3xs">{translate("profile.wishlist.remove_wishlist")}</span>
        </button>
      </div>
    </article>
  );
}
