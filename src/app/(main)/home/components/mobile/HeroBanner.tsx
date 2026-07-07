"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { FEATURED_MOVIES } from "../shared/featured";

const SWIPE_THRESHOLD = 50;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movie = FEATURED_MOVIES[index];

  const goTo = useCallback(
    (next: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => setIndex(next), 150);
      setTimeout(() => setFading(false), 300);
    },
    [fading],
  );

  const prev = () =>
    goTo((index - 1 + FEATURED_MOVIES.length) % FEATURED_MOVIES.length);
  const next = () => goTo((index + 1) % FEATURED_MOVIES.length);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Only handle horizontal swipes
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

    if (dx > 0) prev();
    else next();
  };

  // Auto-advance every 5s, pause on touch
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % FEATURED_MOVIES.length);
        setFading(false);
      }, 150);
    }, 5000);

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, []);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % FEATURED_MOVIES.length);
        setFading(false);
      }, 150);
    }, 5000);
  };

  return (
    <section
      className="relative h-55 w-full overflow-hidden"
      aria-label="Featured films"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Link
        href={`/movies/${movie.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${movie.title}`}
        onClick={resetAuto}
      >
        <div
          className={`relative h-full w-full transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          <Image
            key={index}
            className="object-cover"
            src={movie.src || "/images/hero-interstellar.jpg"}
            alt={movie.title}
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
              {movie.label}
            </span>
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-(--color-gold)">
              <Star size={9} fill="currentColor" /> {movie.rating}
            </span>
          </div>
          <h2 className="font-black uppercase leading-tight tracking-tight text-white text-lg">
            {movie.title}
          </h2>
        </div>
      </Link>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-0 right-0 z-20 flex items-center justify-center">
        <div className="flex gap-1.5">
          {FEATURED_MOVIES.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 16 : 5,
                background:
                  i === index
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
