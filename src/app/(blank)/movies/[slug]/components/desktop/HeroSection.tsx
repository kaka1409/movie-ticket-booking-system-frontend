"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Heart, Play, Star, Ticket } from "lucide-react";
import TrailerModal from "@/components/shared/TrailerModal";
import { useMovieDetail } from "@/features/movies/context";
import { useWishlist, type WishlistFeedback } from "@/features/wishlist/context";
import { useSmartBack } from "@/hooks/useSmartBack";
import { useLocale } from "@/contexts/LocaleContext";

const ICON_BUTTON_CLASS =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/75";

export default function HeroSection() {
  const movie = useMovieDetail();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { translate } = useLocale();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const handleBack = useSmartBack("/movies");

  const liked = isWishlisted(movie.id);

  function buildFeedback(): WishlistFeedback {
    return {
      added: translate("profile.wishlist.toast_added"),
      addFailed: translate("profile.wishlist.toast_add_failed"),
      removeFailed: translate("profile.wishlist.toast_remove_failed"),
      removed: translate("profile.wishlist.removed"),
    };
  }
  const genres = movie.genre
    ? movie.genre
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      <section
        className="relative h-[480px] w-full overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface)"
        aria-label={movie.title}
      >
        {/* Backdrop artwork from the API */}
        <Image
          src={movie.src || "/images/hero-interstellar.jpg"}
          alt={movie.title}
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover object-center"
          priority
        />
        {/* Single dark layer so the text stays readable over the artwork */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/15" />

        <div className="absolute left-5 top-5 z-20">
          <button
            type="button"
            onClick={handleBack}
            aria-label={translate("movies.detail.back")}
            className={ICON_BUTTON_CLASS}
          >
            <ArrowLeft size={18} className="text-(--color-gold-light)" />
          </button>
        </div>

        <div className="absolute right-5 top-5 z-20">
          <button
            type="button"
            onClick={() => toggleWishlist(movie.id, buildFeedback())}
            aria-label={
              liked
                ? translate("movies.detail.remove_wishlist")
                : translate("movies.detail.add_wishlist")
            }
            className={ICON_BUTTON_CLASS}
          >
            <Heart
              size={18}
              className={liked ? "fill-pink-400 text-pink-400" : "text-(--color-gold-light)"}
            />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end gap-6 p-8">
          {/* Poster from the API */}
          <div className="hidden w-32 shrink-0 overflow-hidden rounded-(--radius-lg) border border-white/15 shadow-(--shadow-card) md:block">
            <div className="relative aspect-2/3 w-full">
              <Image
                src={movie.src || "/images/movie-poster-placeholder.jpg"}
                alt={movie.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="mb-3 text-4xl leading-tight font-extrabold text-(--color-text-primary) lg:text-5xl">
              {movie.title}
            </h1>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm font-bold text-(--color-gold)">
                <Star size={14} className="fill-(--color-gold)" />
                {movie.rating}/10
              </span>

              <span className="h-4 w-px bg-(--color-border)" />

              {genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-(--radius-sm) border border-(--color-border) bg-(--color-surface) px-2.5 py-0.5 text-[10px] font-black tracking-wide text-(--color-text-secondary) uppercase"
                >
                  {genre}
                </span>
              ))}

              <span className="h-4 w-px bg-(--color-border)" />

              {movie.duration > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-(--color-text-muted)">
                  <Clock size={13} />
                  {movie.duration} {translate("movies.detail.min")}
                </span>
              )}

              {movie.ageRating && (
                <>
                  <span className="h-4 w-px bg-(--color-border)" />
                  <span className="rounded-(--radius-sm) border border-(--color-border) px-2 py-0.5 text-[10px] font-bold text-(--color-text-secondary)">
                    {movie.ageRating}
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/booking/${movie.slug}/cinema`}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-md) bg-(--color-gold) px-6 py-3 text-sm font-bold text-(--color-bg) no-underline shadow-(--shadow-glow) transition-all duration-150 hover:bg-(--color-gold-dark) active:scale-[0.98]"
              >
                <Ticket size={16} />
                {translate("movies.detail.book_ticket")}
              </Link>

              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-md) border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold text-(--color-text-primary) backdrop-blur-sm transition-all duration-150 hover:bg-white/15 active:scale-[0.98]"
              >
                <Play size={16} className="fill-current" />
                {translate("movies.detail.watch_trailer")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={movie.title}
      />
    </>
  );
}
