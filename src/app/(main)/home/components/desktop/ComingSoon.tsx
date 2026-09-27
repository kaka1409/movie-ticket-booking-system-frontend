"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useWishlist } from "@/features/wishlist/context";
import { formatDate } from "@/libs/utils";
import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";

const ITEMS_PER_PAGE = 3;

export default function ComingSoon({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate } = useLocale();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [startIndex, setStartIndex] = useState(0);

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const maxIndex = Math.max(0, movies.length - ITEMS_PER_PAGE);

  const prev = () => {
    setStartIndex((current) => Math.max(0, current - 1));
  };

  const next = () => {
    setStartIndex((current) => Math.min(maxIndex, current + 1));
  };

  const visibleMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="mx-auto max-w-7xl px-8 pt-12 pb-6" aria-label="Coming Soon Movies">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
            <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
            {translate("home.desktop.coming_soon")}
          </h2>
          <span className="rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-3 py-1 text-[11px] font-bold tracking-wider text-(--color-gold) uppercase">
            SEASON 2026
          </span>
        </div>

        {/* Carousel controls */}
        {movies.length > ITEMS_PER_PAGE && (
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={startIndex === 0}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-white transition-all ${
                startIndex === 0
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-(--color-gold) hover:text-(--color-gold)"
              }`}
              aria-label="Previous coming soon movies"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              disabled={startIndex >= maxIndex}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-white transition-all ${
                startIndex >= maxIndex
                  ? "cursor-not-allowed opacity-40"
                  : "hover:border-(--color-gold) hover:text-(--color-gold)"
              }`}
              aria-label="Next coming soon movies"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Cards Slider / Grid */}
      <div className="mb-8 grid grid-cols-3 gap-5">
        {visibleMovies.map((movie) => {
          const wished = isWishlisted(movie.id);

          return (
            <article
              key={movie.id}
              className="group relative overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-all duration-300 hover:-translate-y-1 hover:border-(--color-gold)/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-(--color-surface-2)">
                <Image
                  src={movie.src || "/images/movie-poster-placholder.jpg"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Release Date Pill */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-1 text-[11px] font-extrabold tracking-wider uppercase text-black shadow">
                    {formatDate(movie.releaseDate)}
                  </span>
                </div>

                {/* Movie info & Notify button inside poster bottom */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[10px] font-bold tracking-widest uppercase text-(--color-gold)">
                      {movie.genre}
                    </p>
                    <Link href={`/movies/${movie.slug}`}>
                      <h3 className="truncate text-base font-extrabold tracking-tight text-white transition-colors group-hover:text-(--color-gold)">
                        {movie.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Wishlist / Remind Me Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(movie.id)}
                    className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all ${
                      wished
                        ? "border-(--color-gold) bg-(--color-gold) text-black shadow-md"
                        : "border-white/20 bg-black/60 text-white backdrop-blur-xs hover:border-(--color-gold) hover:text-(--color-gold)"
                    }`}
                    aria-label={`Notify me about ${movie.title}`}
                    title={wished ? "Saved to Wishlist" : "Remind Me"}
                  >
                    <Bell size={16} fill={wished ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Bottom synopsis preview & link */}
              <div className="flex items-center justify-between p-3.5 text-xs">
                <span className="line-clamp-1 flex-1 text-(--color-text-muted) pr-2">
                  {movie.synopsis}
                </span>
                <Link
                  href={`/movies/${movie.slug}`}
                  className="shrink-0 font-bold text-(--color-gold) hover:underline"
                >
                  {translate("common.more_info") || "Info"} →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Explore Link CTA */}
      <div className="flex justify-center">
        <Link
          href="/movies?status=coming_soon"
          className="rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-8 py-2.5 text-[13px] font-semibold text-white transition-all hover:border-(--color-gold) hover:text-(--color-gold)"
        >
          {translate("home.desktop.coming_soon_desc")}
        </Link>
      </div>
    </section>
  );
}
