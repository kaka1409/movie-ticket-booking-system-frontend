import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { Movie } from "@/features/movies/types";

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <Link href={`/movies/${movie.slug}`} className="block w-[130px]">
    <article className="cursor-pointer">
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-(--radius-lg) bg-(--color-surface-2)"
      >
        <Image
          src={movie.src || "/images/movie-poster-placholder.jpg"}
          alt={movie.title}
          width={130}
          height={195}
          className="h-full w-full object-cover"
        />
        {(movie.rating > 0 || movie.duration > 0) && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-(--space-sm)">
            {movie.rating > 0 && (
              <span
                className="
                  flex items-center gap-0.5 rounded-(--radius-sm)
                  px-1.5 py-0.5 text-xs font-bold text-black bg-(--color-gold)
                "
              >
                <Star size={12} fill="currentColor" />
                {movie.rating}
              </span>
            )}
            {movie.duration > 0 && (
              <span
                className="
                  flex items-center gap-0.5 rounded-(--radius-sm) p-0.5
                  text-xs font-bold bg-black/70 text-(--color-text-primary)
                "
              >
                <Clock size={12} />
                {movie.duration} min
              </span>
            )}
          </div>
        )}
      </div>
      <p className="mt-(--space-sm) text-md font-medium text-white">{movie.title}</p>
      <p className="mt-0.5 text-xs text-(--color-gold-light)">{movie.genre}</p>
    </article>
  </Link>
);

export default MovieCard;
