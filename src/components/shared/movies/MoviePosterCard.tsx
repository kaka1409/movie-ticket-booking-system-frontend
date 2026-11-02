"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { PRESS_SOFT_CLASS } from "@/libs/press";
import type { Movie } from "@/features/movies/types";

/**
 * Desktop movie poster card shared by the /movies grid and the movie detail
 * "You may also like" section. `isBookable` decides the footer: `undefined`
 * renders only title + genre (recommendations), `true` renders "Book Now",
 * `false` renders the muted "Coming soon" label.
 */
export default function MoviePosterCard({
  movie,
  isBookable,
}: {
  movie: Movie;
  isBookable?: boolean;
}) {
  const { translate } = useLocale();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition duration-300 hover:-translate-y-1.5 hover:border-(--color-gold)/50 hover:shadow-xl active:scale-[0.99]">
      <Link
        href={`/movies/${movie.slug}`}
        className="relative block aspect-[2/3] w-full overflow-hidden bg-(--color-surface-2)"
      >
        <Image
          src={movie.src || "/images/movie-poster-placeholder.jpg"}
          alt={movie.title}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 1024px) 240px, 215px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 transition-opacity group-hover:opacity-80" />

        <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
          {movie.rating !== null ? (
            <span className="flex items-center gap-1 rounded-(--radius-sm) bg-(--color-gold) px-2 py-0.5 text-xs font-black text-black">
              <Star size={11} fill="currentColor" /> {movie.rating}
            </span>
          ) : (
            <span />
          )}
          {movie.ageRating && (
            <span className="rounded-(--radius-sm) border border-white/20 bg-black/60 px-1.5 py-0.5 text-2xs font-bold text-white backdrop-blur-xs">
              {movie.ageRating}
            </span>
          )}
        </div>

        {movie.duration > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-(--radius-sm) bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
            <Clock size={11} className="text-(--color-gold)" />
            <span>
              {movie.duration} {translate("common.min")}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link href={`/movies/${movie.slug}`}>
            <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-(--color-gold)">
              {movie.title}
            </h3>
          </Link>
          <p className="mt-1 truncate text-xs text-(--color-text-secondary)">{movie.genre}</p>
        </div>

        {isBookable === true ? (
          <Link
            href={`/booking/${movie.slug}/cinema`}
            className={`mt-4 cursor-pointer rounded-(--radius-sm) bg-(--color-gold) py-2 text-center text-xs font-bold tracking-wider text-black no-underline transition hover:bg-(--color-gold-light) ${PRESS_SOFT_CLASS}`}
          >
            {translate("movies.book_now")}
          </Link>
        ) : isBookable === false ? (
          <p className="mt-4 rounded-(--radius-sm) border border-(--color-border) py-2 text-center text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
            {translate("movies.coming_soon")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
