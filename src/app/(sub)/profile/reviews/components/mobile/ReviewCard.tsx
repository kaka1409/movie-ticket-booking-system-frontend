import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/features/movies/types";
import StarRating from "./StarRating";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReviewCard({
  movie,
  className = "",
}: {
  movie: Movie;
  className?: string;
}) {
  return (
    <Link href={`/movies/${movie.slug}`}>
      <article
        data-review-card
        className={`flex gap-3 rounded-2xl bg-(--color-surface) p-4 shadow-[--shadow-card] ${className}`}
      >
        {movie.src && (
          <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl">
            <Image
              src={movie.src}
              alt={movie.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-(--color-text-primary)">
              {movie.title}
            </h2>
            <span className="shrink-0 text-xs text-(--color-text-muted)">
              {formatDate(movie.releaseDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StarRating rating={movie.rating / 2} />
            <span className="text-sm font-medium text-(--color-text-primary)">
              {movie.rating.toFixed(1)}
            </span>
          </div>

          <span className="inline-block w-fit text-[10px] font-bold tracking-wide uppercase text-(--color-gold) bg-(--color-gold)/10 rounded-full px-2 py-0.5">
            {movie.genre}
          </span>

          <p className="line-clamp-2 text-sm leading-snug text-(--color-text-muted)">
            {movie.synopsis}
          </p>
        </div>
      </article>
    </Link>
  );
}
