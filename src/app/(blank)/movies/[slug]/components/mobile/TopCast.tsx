"use client";

import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { useMovieDetail } from "@/features/movies/context";
import { useLocale } from "@/contexts/LocaleContext";

export default function TopCast() {
  const movie = useMovieDetail();
  const { translate } = useLocale();

  return (
    <section className="px-4">
      <SectionHeader variant="goldBar">{translate("movies.detail.top_cast")}</SectionHeader>

      <div className="flex flex-nowrap gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide pb-1">
        {movie.cast.map((actor) => (
          <div key={actor.name} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-(--color-surface) border border-(--color-border) overflow-hidden">
              <Image
                src={actor.src}
                alt={actor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-(--color-text-primary) text-xs font-semibold text-center leading-tight">
              {actor.name}
            </p>
            <p className="text-(--color-text-muted) text-2xs text-center">{actor.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
