"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";

export default function NowShowing({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate } = useLocale();

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-8 pt-12 pb-4" aria-label="Now Showing Movies">
      {/* Header */}
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
            <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
            {translate("home.desktop.now_showing")}
          </h2>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {translate("home.desktop.now_showing_desc")}
          </p>
        </div>
        <Link
          href="/movies?status=now_showing"
          className="group flex items-center gap-1 text-xs font-bold tracking-wide text-(--color-gold) transition-all hover:text-(--color-gold-light)"
        >
          {translate("home.desktop.explore_all")}
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-6">
        {movies.map((movie) => (
          <article
            key={movie.id}
            className="group relative flex flex-col overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) transition-all duration-300 hover:-translate-y-1.5 hover:border-(--color-gold)/50 hover:shadow-xl"
          >
            {/* Poster Thumbnail */}
            <Link
              href={`/movies/${movie.slug}`}
              className="relative block aspect-[2/3] w-full overflow-hidden bg-(--color-surface-2)"
            >
              <Image
                src={movie.src || "/images/movie-poster-placholder.jpg"}
                alt={movie.title}
                fill
                sizes="(max-width: 1200px) 25vw, 300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 transition-opacity group-hover:opacity-80" />

              {/* Badges on Poster */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                {movie.rating > 0 ? (
                  <span className="flex items-center gap-1 rounded-(--radius-sm) bg-(--color-gold) px-2 py-0.5 text-xs font-black text-black">
                    <Star size={11} fill="currentColor" /> {movie.rating}
                  </span>
                ) : (
                  <span />
                )}
                {movie.ageRating && (
                  <span className="rounded-(--radius-xs) border border-white/20 bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                    {movie.ageRating}
                  </span>
                )}
              </div>

              {movie.duration > 0 && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-(--radius-sm) bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                  <Clock size={11} className="text-(--color-gold)" />
                  <span>
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                </div>
              )}
            </Link>

            {/* Info & Action */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <Link href={`/movies/${movie.slug}`}>
                  <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-(--color-gold)">
                    {movie.title}
                  </h3>
                </Link>
                <p className="mt-1 text-xs text-(--color-text-secondary)">{movie.genre}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/booking/${movie.slug}/cinema`}
                  className="flex-1 cursor-pointer rounded-(--radius-sm) bg-(--color-gold) py-2 text-center text-xs font-bold tracking-wider text-black no-underline transition-all hover:bg-(--color-gold-light)"
                >
                  {translate("home.desktop.book_now")}
                </Link>
                {/*<Link
                  href={`/movies/${movie.slug}`}
                  className="flex items-center justify-center rounded-(--radius-sm) border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-semibold text-white no-underline transition-colors hover:border-(--color-gold)/50 hover:text-(--color-gold)"
                  aria-label={`View details for ${movie.title}`}
                >
                  <ChevronRight size={14} />
                </Link>*/}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
