import React from "react";
import Image from "next/image";
import { Star, Clock } from "lucide-react";

interface MovieCardProps {
  title: string;
  genre: string;
  rating: number;
  duration: number;
  src?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, genre, rating, duration, src }) => (
  <article className="w-[130px]">
    <div
      className="relative aspect-[2/3] overflow-hidden rounded-(--radius-lg) bg-(--color-surface-2)"
    >
      <Image
        src={src || "/images/movie-poster-placholder.jpg"}
        alt={title}
        width={130}
        height={195}
        className="h-full w-full object-cover"
      />
      {(rating > 0 || duration > 0) && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-(--space-sm)">
          {rating > 0 && (
            <span
              className="
                flex items-center gap-0.5 rounded-(--radius-sm)
                px-1.5 py-0.5 text-xs font-bold text-black bg-(--color-gold)
              "
            >
              <Star size={12} fill="currentColor" />
              {rating}
            </span>
          )}
          {duration > 0 && (
            <span
              className="
                flex items-center gap-0.5 rounded-(--radius-sm) p-0.5
                text-xs font-bold bg-black/70 text-(--color-text-primary)
              "
            >
              <Clock size={12} />
              {duration} min
            </span>
          )}
        </div>
      )}
    </div>
    <p className="mt-(--space-sm) text-md font-medium text-white">{title}</p>
    <p className="mt-0.5 text-xs text-(--color-gold-light)">{genre}</p>
  </article>
);

export default MovieCard;
