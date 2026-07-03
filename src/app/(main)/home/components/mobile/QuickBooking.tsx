"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { MOVIES, DATES, SHOWTIMES, CINEMAS } from "@/libs/constants";

export default function QuickBooking() {
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
          className={`text-(--color-gold) transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
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
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border)"
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
                {SHOWTIMES.map((st) => (
                  <button
                    key={st}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      selectedShowtime === st
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => setSelectedShowtime(st)}
                    aria-pressed={selectedShowtime === st}
                  >
                    {st}
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
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border)"
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
              className="w-full rounded-(--radius-sm) bg-(--color-gold) py-3 text-center text-sm font-bold tracking-widest text-black transition-opacity hover:opacity-90"
            >
              {t("quick_booking.book")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
