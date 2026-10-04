"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Movie } from "@/features/movies/types";

const REASONS = [
  "Top Rated by Critics",
  "Trending in Theatres",
  "Because you liked Sci-Fi",
  "Popular among Members",
  "Must Watch This Week",
];

export default function ForYou({ movies }: { movies: Movie[] }) {
  const { translate } = useLocale();
  const { user, isAuthenticated } = useAuth();

  if (movies.length === 0) return null;

  const recommendedMovies = movies.slice(0, 5);

  const greetingName = isAuthenticated && user?.name ? user.name.split(" ")[0].toUpperCase() : null;

  return (
    <section
      className="mt-10 py-14"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(255,204,77,0.04) 50%, transparent 100%)",
      }}
      aria-label={translate("home.desktop.for_you_section")}
    >
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-9 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/30 bg-(--color-gold)/10 px-3 py-1 text-[11px] font-bold tracking-wider text-(--color-gold) uppercase">
            <Sparkles size={12} />
            Personalized Picks
          </div>
          <h2 className="text-[28px] font-black tracking-tight text-white">
            {translate("home.desktop.for_you")}
            {greetingName ? `, ${greetingName}` : ""}
          </h2>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {isAuthenticated
              ? "Based on your watch history and favorite genres"
              : "Discover handpicked movies trending this week"}
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {recommendedMovies.map((movie, index) => (
            <Link key={movie.id} href={`/movies/${movie.slug}`} className="group block">
              <article className="cursor-pointer">
                {/* Poster */}
                <div className="relative mb-2.5 aspect-[2/3] w-full overflow-hidden rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) transition-all duration-300 group-hover:-translate-y-1 group-hover:border-(--color-gold)/50 group-hover:shadow-lg">
                  <Image
                    src={movie.src || "/images/movie-poster-placholder.jpg"}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 1200px) 20vw, 220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                  {movie.rating > 0 && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-(--radius-sm) bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-(--color-gold) backdrop-blur-xs">
                      <Star size={10} fill="currentColor" /> {movie.rating}
                    </div>
                  )}
                </div>

                {/* Details */}
                <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-(--color-gold)">
                  {movie.title}
                </h3>
                <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">
                  {REASONS[index % REASONS.length]}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
