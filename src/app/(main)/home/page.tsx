"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  MOVIES,
  DATES,
  SHOWTIMES,
  CINEMAS,
  NOW_SHOWING,
  COMING_SOON,
} from "@/libs/constants";

/* ─── SearchBar ─────────────────────────────────────────── */
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const { t } = useLocale();
  return (
    <div className="mx-(--space-md) flex items-center gap-3 rounded-md bg-(--color-surface) px-(--space-md) py-3">
      <Search size={16} className="shrink-0 text-(--color-text-muted)" />
      <input
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-(--color-text-muted)"
        placeholder={t("header.search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

/* ─── MovieCard ─────────────────────────────────────────── */
interface MovieCardProps {
  title: string;
  genre: string;
  wide?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, genre, wide }) => (
    <article style={{ width: wide ? 160 : 130 }}>
      <div
        className="overflow-hidden rounded-(--radius-lg)"
        style={{ aspectRatio: "2/3", background: "var(--color-surface-2)" }}
      >
        <div
          className="flex h-full w-full items-end p-(--space-sm)"
          style={{
            background: "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%)",
          }}
        >
          <span
            className="text-xs font-bold leading-tight"
            style={{ color: "var(--color-gold-light)", textShadow: "0 1px 4px #000" }}
          >
            {title}
          </span>
        </div>
      </div>
      <p className="mt-(--space-sm) text-sm font-medium text-white">{title}</p>
    <p className="text-xs text-(--color-text-muted)">{genre}</p>
  </article>
);

/* ─── QuickBooking ──────────────────────────────────────── */
const QuickBooking: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedShowtime, setSelectedShowtime] = useState(SHOWTIMES[2]);
  const [selectedCinema, setSelectedCinema] = useState(CINEMAS[0]);
  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useLocale();

  return (
    <section
        className="mx-(--space-md) rounded-(--radius-sm) p-(--space-md) bg-(--color-surface)"
        aria-labelledby="qb-heading"
    >
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
      >
        <h2 id="qb-heading" className="text-lg font-bold text-(--color-gold)">
          {t("quick_booking.title")}
        </h2>
        <ChevronDown
          aria-hidden
          size={18}
          className="text-(--color-gold) transition-transform duration-200"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="mt-(--space-md) space-y-(--space-md)">
            <div>
              <label
                className="mb-(--space-sm) block text-xs font-semibold text-(--color-text-secondary)"
                htmlFor="qb-movie"
              >
                {t("quick_booking.select_movie")}
              </label>
              <select
                id="qb-movie"
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none"
                style={{ border: "1px solid var(--color-border)" }}
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                {MOVIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {t("quick_booking.date")}
              </span>
              <div className="flex gap-(--space-sm)">
                {DATES.map((d) => (
                  <button
                    key={d.value}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      selectedDate === d.value
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => setSelectedDate(d.value)}
                    aria-pressed={selectedDate === d.value}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {t("quick_booking.showtime")}
              </span>
              <div className="flex flex-wrap gap-(--space-sm)">
                {SHOWTIMES.map((t) => (
                  <button
                    key={t}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      selectedShowtime === t
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => setSelectedShowtime(t)}
                    aria-pressed={selectedShowtime === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)"
                htmlFor="qb-cinema"
              >
                {t("quick_booking.cinema")}
              </label>
              <select
                id="qb-cinema"
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none"
                style={{ border: "1px solid var(--color-border)" }}
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
              >
                {CINEMAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="
                w-full rounded-(--radius-sm) bg-(--color-gold) py-3 text-center text-sm font-bold 
                tracking-widest text-black transition-opacity hover:opacity-90
              "
            >
              {t("quick_booking.book")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── HeroBanner ────────────────────────────────────────── */
const HeroBanner: React.FC = () => {
  const { t } = useLocale();
  return (
  <section className="relative h-55 w-full overflow-hidden" aria-label="Featured film">
    <Image
      src="/images/hero-interstellar.jpg"
      alt=""
      fill
      className="object-cover"
      priority
    />

    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.2) 50%, transparent 100%)",
      }}
    />

      <span
        className="
          absolute bottom-(--space-md) left-(--space-md) z-20 rounded-(--radius-sm) bg-(--color-gold)
          px-(--space-sm) py-0.5 text-[0.6rem] font-bold tracking-widest text-black
        "
      >
        {t("home.promo")}
    </span>
  </section>
);
};

/* ─── MovieRow ──────────────────────────────────────────── */
interface MovieRowProps {
  title: string;
  movies: typeof NOW_SHOWING;
  wide?: boolean;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, wide }) => {
  const { t } = useLocale();
  return (
    <section
      className="px-(--space-md)"
      aria-labelledby={`${title.replace(/\s/g, "-").toLowerCase()}-heading`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2
          id={`${title.replace(/\s/g, "-").toLowerCase()}-heading`}
          className="text-lg font-bold text-white"
        >
          {title}
        </h2>
        <button className="text-xs font-semibold tracking-wide text-(--color-gold)">
          {t("home.movie_row.see_all")}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-(--space-sm)" role="list">
        {movies.map((m) => (
          <div key={m.title} role="listitem">
            <MovieCard {...m} wide={wide} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Page ──────────────────────────────────────────────── */
export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-(--space-lg) pb-(--space-xl)">
      <HeroBanner />
      <QuickBooking />
      <SearchBar />
      <MovieRow title={t("home.movie_row.now_showing")} movies={NOW_SHOWING} />
      <MovieRow title={t("home.movie_row.coming_soon")} movies={COMING_SOON} wide />
    </div>
  );
}
