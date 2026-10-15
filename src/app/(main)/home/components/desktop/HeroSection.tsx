"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { FeaturedMovie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";
import TrailerModal from "@/components/shared/TrailerModal";

export default function HeroSection({
  movies,
  error,
}: {
  movies: FeaturedMovie[];
  error?: ErrorResponse["error"] | null;
}) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { translate } = useLocale();
  const slideTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      slideTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    };
  }, []);

  // The list can shrink under us (locale refetch) — clamp on read instead of
  // crashing on a stale index (a sync setState effect trips the lint rule).
  const safeIndex = Math.min(index, Math.max(movies.length - 1, 0));

  const goTo = useCallback(
    (nextIndex: number) => {
      if (fading) return;
      setFading(true);
      slideTimersRef.current = [
        window.setTimeout(() => setIndex(nextIndex), 150),
        window.setTimeout(() => setFading(false), 300),
      ];
    },
    [fading],
  );

  const prev = useCallback(() => {
    goTo((safeIndex - 1 + movies.length) % movies.length);
  }, [goTo, safeIndex, movies.length]);
  const next = useCallback(() => {
    goTo((safeIndex + 1) % movies.length);
  }, [goTo, safeIndex, movies.length]);

  // Autoplay carousel every 6s unless paused
  useEffect(() => {
    if (movies.length <= 1 || isPaused || isTrailerOpen) return;
    const interval = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(interval);
  }, [movies.length, isPaused, isTrailerOpen, next]);

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const movie = movies[safeIndex];

  return (
    <>
      <section
        className="group relative mx-auto w-full max-w-7xl px-8 pt-6 pb-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label={translate("home.desktop.featured_section")}
      >
        <div className="relative h-[360px] w-full overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) md:h-[420px] lg:h-[480px]">
          {/* Backdrop Image */}
          <div
            className={`relative h-full w-full transition-opacity duration-300 ${
              fading ? "opacity-30" : "opacity-100"
            }`}
          >
            <Image
              src={movie.src || "/images/hero-interstellar.jpg"}
              alt={movie.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
          </div>

          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prev}
            className="
              absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/15 
              bg-black/50 p-2.5 text-white backdrop-blur-sm transition-all duration-300
              opacity-80 hover:opacity-100 hover:bg-black/75 hover:scale-110
            "
            aria-label={translate("home.desktop.prev_slide")}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            className="
              absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/15 
              bg-black/50 p-2.5 text-white backdrop-blur-sm transition-all duration-300
              opacity-80 hover:opacity-100 hover:bg-black/75 hover:scale-110
            "
            aria-label={translate("home.desktop.next_slide")}
          >
            <ChevronRight size={22} />
          </button>

          {/* Movie Details Content (Always clearly visible) */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center pl-12 pr-6 md:pl-16 md:pr-8 max-w-[520px] lg:max-w-[620px]">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest uppercase text-black">
                {movie.label}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-(--color-gold)">
                <Star size={13} fill="currentColor" /> {movie.rating}/10
              </span>
              <span className="text-[11px] text-(--color-text-muted)">•</span>
              <span className="text-xs text-(--color-text-secondary)">
                {movie.duration} {translate("common.min")}
              </span>
              <span className="text-[11px] text-(--color-text-muted)">•</span>
              <span className="text-xs text-(--color-text-secondary)">{movie.genre}</span>
              {movie.ageRating && (
                <>
                  <span className="text-[11px] text-(--color-text-muted)">•</span>
                  <span className="rounded-(--radius-xs) border border-white/20 px-1.5 py-0.2 text-[10px] font-bold text-(--color-text-secondary)">
                    {movie.ageRating}
                  </span>
                </>
              )}
            </div>

            <h1 className="mb-3.5 font-black uppercase leading-[1.02] tracking-tight text-white text-3xl md:text-4xl lg:text-5xl drop-shadow-md line-clamp-2">
              {movie.title}
            </h1>

            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-white/85 drop-shadow">
              {movie.description || movie.synopsis}
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href={`/movies/${movie.slug}`}
                className="cursor-pointer rounded-(--radius-md) bg-(--color-gold) px-7 py-3 text-[13px] font-extrabold tracking-wide text-black no-underline transition-all hover:bg-(--color-gold-light) hover:scale-102"
              >
                {translate("home.desktop.book_now")}
              </Link>
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-md) border border-white/20 bg-white/10 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-102"
              >
                <Play size={14} fill="currentColor" />
                {translate("home.desktop.watch_trailer")}
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-xs">
              {movies.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${translate("home.desktop.go_to_slide")} ${i + 1}`}
                  className="h-1.5 cursor-pointer rounded-full transition-all duration-300"
                  style={{
                    width: i === safeIndex ? 24 : 8,
                    background: i === safeIndex ? "var(--color-gold)" : "rgba(255,255,255,0.3)",
                  }}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={movie.title}
      />
    </>
  );
}
