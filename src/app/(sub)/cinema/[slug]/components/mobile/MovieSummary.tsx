"use client";

import { Clock, Star } from "lucide-react";
import { Movie } from "@/features/movies/types";

export default function MovieSummary({ movie }: { movie: Movie }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-surface) border border-(--color-border)">
      {/* Mini poster */}
      <div
        className="w-16 overflow-hidden flex-shrink-0 flex items-end bg-(--color-surface-2)"
        style={{ aspectRatio: "2/3" }}
      >
        {movie.src ? (
          <img
            src={movie.src}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[8px] font-black uppercase tracking-tight leading-tight text-(--color-text-muted)">
            {movie.title}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-base mb-1 text-(--color-text-primary)">
          {movie.title}
        </h2>
        <p className="flex items-center gap-1.5 text-xs mb-2 text-(--color-text-muted)">
          <Clock size={11} />
          {movie.duration} min
          <span>•</span>
          {movie.genre}
        </p>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-(--color-surface-2) text-(--color-text-secondary) border border-(--color-border)">
            {movie.ageRating}
          </span>
          {movie.rating > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-(--color-surface-2) text-(--color-gold) border border-(--color-border)">
              <Star size={10} className="fill-current" />
              {movie.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
