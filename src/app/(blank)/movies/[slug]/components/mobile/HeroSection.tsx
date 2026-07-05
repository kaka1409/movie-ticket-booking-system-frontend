"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Play, Star, Clock } from "lucide-react";
import { useMovie } from "../shared/MovieContext";

export default function HeroSection() {
  const movie = useMovie();

  return (
    <section className="relative w-full h-[280px]">
      <Image
        src={movie.src || "/images/movie-poster-placholder.jpg"}
        alt={movie.title}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-(--color-bg)" />

      <button
        className="absolute inset-0 flex items-center justify-center group"
        aria-label="Watch trailer"
      >
        <div className="w-14 h-14 rounded-full backdrop-blur-xs bg-(--color-gold)/20 border border-(--color-gold) flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <Play size={18} className="text-(--color-gold)" />
        </div>
      </button>

      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={20} className="text-(--color-gold-light)" />
        </Link>

        <Link
          href="/notifications"
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
          aria-label="Notify me"
        >
          <Bell size={18} className="text-(--color-gold-light)" />
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 px-4">
        <div className="w-20 h-28 rounded-xl shrink-0 border border-(--color-border) overflow-hidden">
          <Image
            src={movie.src || "/images/movie-poster-placholder.jpg"}
            alt={movie.title}
            width={200}
            height={280}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 pb-1">
          <h1 className="text-(--color-text-primary) text-2xl font-extrabold leading-tight mb-1">
            {movie.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-(--color-gold) text-xs font-bold">
              <Star size={11} className="fill-(--color-gold)" />
              {movie.rating}/10
            </span>
            <span className="text-(--color-text-muted) text-xs">•</span>
            <span className="text-(--color-gold-light) text-xs">
              {movie.genre}
            </span>
            <span className="text-(--color-text-muted) text-xs">•</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary) text-xs">
              <Clock size={11} />
              {movie.duration} min
            </span>
          </div>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border border-(--color-border) text-(--color-text-secondary)">
            {movie.ageRating}
          </span>
        </div>
      </div>
    </section>
  );
}
