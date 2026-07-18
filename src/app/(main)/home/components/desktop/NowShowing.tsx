"use client";

import Link from "next/link";
import { Star, Clock, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const NOW_SHOWING = [
  {
    id: 1, title: "Dune: Part Two", rating: 9.1, duration: "2h 46m", genre: "Sci-Fi",
    gradient: "linear-gradient(160deg,#2b1a00 0%,#5c3500 60%,#1a0d00 100%)",
  },
  {
    id: 2, title: "The Batman: Echoes", rating: 8.4, duration: "2h 55m", genre: "Action",
    gradient: "linear-gradient(160deg,#0d1520 0%,#1a2d40 60%,#080e18 100%)",
  },
  {
    id: 3, title: "Neon Nights 2077", rating: 7.9, duration: "1h 58m", genre: "Thriller",
    gradient: "linear-gradient(160deg,#0d001a 0%,#2a005c 60%,#1a0033 100%)",
  },
  {
    id: 4, title: "Symphony of Silence", rating: 8.7, duration: "2h 12m", genre: "Drama",
    gradient: "linear-gradient(160deg,#0a0a00 0%,#2a2000 60%,#100e00 100%)",
  },
];

export default function NowShowing() {
  const { translate } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-8 pt-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
            <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
            {translate("home.desktop.now_showing")}
          </h2>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {translate("home.desktop.now_showing_desc")}
          </p>
        </div>
        <Link
          href="/movies?status=now_showing"
          className="flex items-center gap-1 text-xs font-bold tracking-wide text-(--color-gold)"
        >
          {translate("home.desktop.explore_all")} <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {NOW_SHOWING.map((movie) => (
          <article
            key={movie.id}
            className="
              cursor-pointer overflow-hidden rounded-(--radius-lg) border border-(--color-border)
              bg-(--color-surface) transition-all hover:translate-y-[-2px]
            "
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "rgba(255,204,77,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--color-border)";
            }}
          >
            <div
              className="flex aspect-[3/4] w-full items-end p-3"
              style={{ background: movie.gradient }}
            >
              <span className="text-[22px] font-black uppercase tracking-tight text-white/15">
                {movie.title.split(":")[0].split(" ")[0]}
              </span>
            </div>

            <div className="px-3.5 pb-3.5 pt-3">
              <h3 className="mb-1.5 text-sm font-bold leading-tight text-white">{movie.title}</h3>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-(--color-gold)">
                  <Star size={10} fill="currentColor" /> {movie.rating}
                </span>
                <span className="flex items-center gap-0.5 text-[11px] text-(--color-text-muted)">
                  <Clock size={10} /> {movie.duration}
                </span>
              </div>
              <button
                className="
                  w-full cursor-pointer rounded-(--radius-sm) bg-(--color-gold) 
                  py-2 text-xs text-black font-bold tracking-wider transition-colors
                "
              >
                {translate("home.desktop.book_now")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
