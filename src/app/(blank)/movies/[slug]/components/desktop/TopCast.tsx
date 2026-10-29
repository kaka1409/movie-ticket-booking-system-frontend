"use client";

import Image from "next/image";
import { useMovieDetail } from "@/features/movies/context";
import { useLocale } from "@/contexts/LocaleContext";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function TopCast() {
  const movie = useMovieDetail();
  const { translate } = useLocale();

  if (movie.cast.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-(--color-text-primary)">
        {translate("movies.detail.top_cast")}
      </h2>

      <div className="flex flex-wrap gap-4">
        {movie.cast.map((actor) => (
          <div key={actor.name} className="group flex w-20 flex-col items-center">
            <div className="h-20 w-20 overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface-2) transition-colors duration-300 group-hover:border-(--color-gold)/40">
              {actor.src ? (
                <Image
                  src={actor.src}
                  alt={actor.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-end justify-center p-2 text-xs font-black tracking-tight text-white/25">
                  {getInitials(actor.name)}
                </span>
              )}
            </div>

            <p className="mt-2 text-center text-xs leading-tight font-semibold text-(--color-text-primary) transition-colors group-hover:text-(--color-gold)">
              {actor.name}
            </p>
            <p className="mt-0.5 text-center text-2xs text-(--color-text-muted)">{actor.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
