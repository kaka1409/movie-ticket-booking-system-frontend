"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { FeaturedMovie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import { useLocale } from "@/contexts/LocaleContext";
import SectionFallback from "@/components/ui/SectionFallback";

const SWIPE_THRESHOLD = 50;

export default function HeroBanner({
  movies,
  error,
}: {
  movies: FeaturedMovie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate } = useLocale();
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slideTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      slideTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    };
  }, []);

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      if (fading || movies.length === 0) return;
      setFading(true);
      slideTimersRef.current = [
        window.setTimeout(() => setIndex(nextIndex), 150),
        window.setTimeout(() => setFading(false), 300),
      ];
    },
    [fading, movies.length],
  );

  const goToPreviousSlide = () => navigateToSlide((index - 1 + movies.length) % movies.length);
  const goToNextSlide = () => navigateToSlide((index + 1) % movies.length);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX > 0) goToPreviousSlide();
    else goToNextSlide();
  };

  if (error) return <SectionFallback error={error} />;

  if (movies.length === 0) return null;

  // The list can shrink under us (locale refetch) — clamp on read instead of
  // crashing on a stale index.
  const safeIndex = Math.min(index, movies.length - 1);
  const currentMovie = movies[safeIndex];

  return (
    <section
      className="relative h-55 w-full overflow-hidden"
      aria-label={translate("home.featured_films")}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Link
        href={`/movies/${currentMovie.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${translate("home.desktop.view_movie_details")} ${currentMovie.title}`}
      >
        <div
          className={`relative h-full w-full transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          <Image
            key={index}
            className="object-cover"
            src={currentMovie.src || "/images/hero-interstellar.jpg"}
            alt={currentMovie.title}
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-hero-gradient" />

        <div className="absolute bottom-10 left-(--space-md) right-(--space-md) z-20">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="rounded-(--radius-sm) bg-(--color-gold) px-1.5 py-0.5 text-[7px] font-bold tracking-widest text-black">
              {currentMovie.label}
            </span>
            <span className="flex items-center gap-0.5 text-2xs font-bold text-(--color-gold)">
              <Star size={9} fill="currentColor" /> {currentMovie.rating}
            </span>
          </div>
          <h2 className="font-black uppercase leading-tight tracking-tight text-white text-lg">
            {currentMovie.title}
          </h2>
        </div>
      </Link>

      <div className="absolute bottom-2 left-0 right-0 z-20 flex items-center justify-center">
        <div className="flex gap-1.5">
          {movies.map((_, movieIndex) => (
            <div
              key={movieIndex}
              className="h-1.5 rounded-full transition duration-300"
              style={{
                width: movieIndex === safeIndex ? 16 : 5,
                background:
                  movieIndex === safeIndex ? "var(--color-gold)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
