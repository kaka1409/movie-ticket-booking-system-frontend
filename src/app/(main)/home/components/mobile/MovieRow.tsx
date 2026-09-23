"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import MovieCard from "@/components/ui/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionFallback from "@/components/ui/SectionFallback";
import type { Movie } from "@/features/movies/types";
import type { ApiError } from "@/libs/api";

interface MovieRowProps {
  titleKey: string;
  movies: Movie[];
  status: "now_showing" | "coming_soon";
  error?: ApiError | null;
}

export default function MovieRow({ titleKey, movies, status, error }: MovieRowProps) {
  const { translate } = useLocale();
  const title = translate(titleKey);

  if (error) return <SectionFallback error={error} />;

  return (
    <section
      className="px-(--space-md)"
      aria-labelledby={`${title.replace(/\s/g, "-").toLowerCase()}-heading`}
    >
      <SectionHeader
        action={
          <Link
            href={`/movies?status=${status}`}
            className="text-xs font-semibold tracking-wide text-(--color-gold)"
          >
            {translate("home.see_all")}
          </Link>
        }
      >
        {title}
      </SectionHeader>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-(--space-sm)" role="list">
        {movies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard movie={movie} minLabel={translate("common.min")} />
          </div>
        ))}
      </div>
    </section>
  );
}
