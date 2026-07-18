"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { FeaturedMovie } from "@/features/movies/types";
import { useLocale } from "@/contexts/LocaleContext";

const SWIPE_THRESHOLD = 50;

export default function HeroBanner({ movies }: { movies: FeaturedMovie[] }) {
  const { translate } = useLocale();
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      if (fading || movies.length === 0) return;
      setFading(true);
      setTimeout(() => setIndex(nextIndex), 150);
      setTimeout(() => setFading(false), 300);
    },
    [fading, movies.length],
  );

  const goToPreviousSlide = () =>
    navigateToSlide((index - 1 + movies.length) % movies.length);
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

  if (movies.length === 0) return null;

  const currentMovie = movies[index];

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
        aria-label={`View ${currentMovie.title}`}
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

        {/* Movie info */}
        <div className="absolute bottom-10 left-(--space-md) right-(--space-md) z-20">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="rounded-(--radius-sm) bg-(--color-gold) px-1.5 py-0.5 text-[7px] font-bold tracking-widest text-black">
              {currentMovie.label}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-(--color-gold)">
              <Star size={9} fill="currentColor" /> {currentMovie.rating}
            </span>
          </div>
          <h2 className="font-black uppercase leading-tight tracking-tight text-white text-lg">
            {currentMovie.title}
          </h2>
        </div>
      </Link>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-0 right-0 z-20 flex items-center justify-center">
        <div className="flex gap-1.5">
          {movies.map((_, movieIndex) => (
            <div
              key={movieIndex}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: movieIndex === index ? 16 : 5,
                background:
                  movieIndex === index
                    ? "var(--color-gold)"
                    : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
