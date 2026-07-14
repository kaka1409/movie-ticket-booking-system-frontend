"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedMovie } from "@/features/movies/types";

export default function HeroSection({ movies }: { movies: FeaturedMovie[] }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  if (movies.length === 0) return null;

  const movie = movies[index];

  const goTo = (next: number) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => setIndex(next), 150);
    setTimeout(() => setFading(false), 300);
  };

  const prev = () => goTo((index - 1 + movies.length) % movies.length);
  const next = () => goTo((index + 1) % movies.length);

  return (
    <section className="group relative flex w-full items-center overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-8 py-16 my-8">
        <div className="absolute left-8 right-8 top-0 bottom-12 overflow-hidden rounded-(--radius-lg)">
          <Link href={`/movies/${movie.slug}`} className="relative block h-full w-full">
            <div className={`relative h-full w-full transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
              <Image
                key={index}
                src={movie.src || "/images/hero-interstellar.jpg"}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </Link>
          <button
            onClick={prev}
            className="
              absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/15 
              bg-black/50 p-2 text-white backdrop-blur-sm transition-all duration-300
              opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110
            "
            aria-label="Previous movie"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="
              absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/15 
              bg-black/50 p-2 text-white backdrop-blur-sm transition-all duration-300
              opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110
            "
            aria-label="Next movie"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="relative z-10 pl-16 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-black">
              {movie.label}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-(--color-gold)">
              <Star size={12} fill="currentColor" /> {movie.rating}/10
            </span>
            <span className="text-[11px] text-(--color-text-muted)">•</span>
            <span className="text-xs text-(--color-text-secondary)">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            <span className="text-[11px] text-(--color-text-muted)">•</span>
            <span className="text-xs text-(--color-text-secondary)">{movie.genre}</span>
          </div>

          <h1 className="mb-4 font-black uppercase leading-[0.95] tracking-tight text-white text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          <p className="mb-7 max-w-[440px] text-sm leading-relaxed text-white/80">
            {movie.description}
          </p>

          <div className="mb-2 flex gap-3">
            <Link
              href={`/movies/${movie.slug}`}
              className="cursor-pointer rounded-(--radius-md) border-none bg-(--color-gold) px-7 py-3 text-[13px] font-extrabold tracking-wide text-black no-underline"
            >
              Book Now
            </Link>
            <button className="flex cursor-pointer items-center gap-1.5 rounded-(--radius-md) border border-white/15 bg-white/8 px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-sm">
              <Play size={14} fill="currentColor" /> Watch Trailer
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center">
            <div className="flex gap-1.5">
              {movies.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 cursor-pointer rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 20 : 6,
                    background:
                      i === index
                        ? "var(--color-gold)"
                        : "rgba(255,255,255,0.2)",
                  }}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
    </section>
  );
}
