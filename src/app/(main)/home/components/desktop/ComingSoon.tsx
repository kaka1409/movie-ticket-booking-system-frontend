"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useWishlist, type WishlistFeedback } from "@/features/wishlist/contexts/WishlistContext";
import { formatDate } from "@/libs/date";
import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { useMoviePreview } from "@/features/movies/contexts/MoviePreviewContext";

const ITEMS_PER_PAGE = 3;

export default function ComingSoon({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate, locale } = useLocale();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { handleCardMouseEnter, handleCardMouseMove, handleCardMouseLeave } = useMoviePreview();
  const [startIndex, setStartIndex] = useState(0);

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const maxIndex = Math.max(0, movies.length - ITEMS_PER_PAGE);

  // The list can shrink under us (locale refetch) — clamp on read so the
  // slice never renders short; the buttons clamp again on write.
  const safeStart = Math.min(startIndex, maxIndex);

  const showPrevious = () => {
    setStartIndex((current) => Math.max(0, current - 1));
  };

  const showNext = () => {
    setStartIndex((current) => Math.min(maxIndex, current + 1));
  };

  const visibleMovies = movies.slice(safeStart, safeStart + ITEMS_PER_PAGE);

  return (
    <section
      className="mx-auto max-w-7xl px-8 pt-12 pb-6"
      aria-label={translate("home.desktop.coming_soon_section")}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
            <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
            {translate("home.desktop.coming_soon")}
          </h2>
          <span className="rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-3 py-1 text-[11px] font-bold tracking-wider text-(--color-gold) uppercase">
            {translate("home.desktop.season")}
          </span>
        </div>

        {movies.length > ITEMS_PER_PAGE && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              disabled={startIndex === 0}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-white transition ${
                startIndex === 0
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-(--color-gold) hover:text-(--color-gold)"
              }`}
              aria-label={translate("home.desktop.prev_coming_soon")}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={showNext}
              disabled={startIndex >= maxIndex}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-white transition ${
                startIndex >= maxIndex
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-(--color-gold) hover:text-(--color-gold)"
              }`}
              aria-label={translate("home.desktop.next_coming_soon")}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMovies.map((movie) => {
          const wished = isWishlisted(movie.id);

          return (
            <article
              key={movie.id}
              onMouseEnter={(event) => handleCardMouseEnter(movie, event)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="group relative overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition duration-300 hover:-translate-y-1 hover:border-(--color-gold)/40"
            >
              {/* Stretched link makes the whole card clickable; the wishlist
                  button and "More info" sit above it with z-10. It must be the
                  last child so it paints over the positioned poster box. */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-(--color-surface-2)">
                <Image
                  src={movie.src || "/images/movie-poster-placeholder.jpg"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {movie.releaseDate && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-1 text-[11px] font-extrabold tracking-wider uppercase text-black shadow">
                      {formatDate(movie.releaseDate, locale)}
                    </span>
                  </div>
                )}

                <div className="absolute right-16 bottom-3 left-3 flex items-end">
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-2xs font-bold tracking-widest uppercase text-(--color-gold)">
                      {movie.genre}
                    </p>
                    <h3 className="truncate text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-(--color-gold)">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist(movie.id, {
                      added: translate("profile.wishlist.toast_added"),
                      addFailed: translate("profile.wishlist.toast_add_failed"),
                      removeFailed: translate("profile.wishlist.toast_remove_failed"),
                    } satisfies WishlistFeedback)
                  }
                  className={`absolute right-3 bottom-3 z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition ${
                    wished
                      ? "border-(--color-gold) bg-(--color-gold) text-black shadow-md"
                      : "border-white/20 bg-black/60 text-white backdrop-blur-xs hover:border-(--color-gold) hover:text-(--color-gold)"
                  }`}
                  aria-label={`${translate("home.desktop.toggle_wishlist")} ${movie.title}`}
                  title={
                    wished
                      ? translate("profile.wishlist.remove_wishlist")
                      : translate("profile.wishlist.add_wishlist")
                  }
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 text-xs">
                <span className="line-clamp-1 flex-1 text-(--color-text-muted) pr-2">
                  {movie.synopsis}
                </span>
                <Link
                  href={`/movies/${movie.slug}`}
                  className="relative z-10 shrink-0 font-bold text-(--color-gold) hover:underline"
                >
                  {translate("common.more_info")} →
                </Link>
              </div>

              <Link
                href={`/movies/${movie.slug}`}
                aria-label={movie.title}
                className="absolute inset-0 z-0"
              />
            </article>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link
          href="/movies?status=coming_soon"
          className="rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-8 py-2.5 text-[13px] font-semibold text-white transition hover:border-(--color-gold) hover:text-(--color-gold)"
        >
          {translate("home.desktop.coming_soon_desc")}
        </Link>
      </div>
    </section>
  );
}
