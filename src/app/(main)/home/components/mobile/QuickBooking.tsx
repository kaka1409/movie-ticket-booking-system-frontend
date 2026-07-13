"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { NOW_SHOWING } from "@/features/movies/mock";
import { CINEMAS, DATES } from "@/features/booking/mock";

export default function QuickBooking() {
  const { t } = useLocale();

  const [selectedMovieSlug, setSelectedMovieSlug] = useState(NOW_SHOWING[0].slug);
  const [selectedCinemaId, setSelectedCinemaId] = useState(CINEMAS[0].id);
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedTime, setSelectedTime] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedCinema = useMemo(
    () => CINEMAS.find((c) => c.id === selectedCinemaId),
    [selectedCinemaId]
  );

  const availableShowtimes = useMemo(
    () => selectedCinema?.showtimes ?? [],
    [selectedCinema]
  );

  const dates3 = DATES.slice(0, 3);

  const canBook = !!selectedMovieSlug && !!selectedCinemaId && !!selectedDate && !!selectedTime;

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
            {/* Movie */}
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
                value={selectedMovieSlug}
                onChange={(e) => setSelectedMovieSlug(e.target.value)}
              >
                {NOW_SHOWING.map((m) => (
                  <option key={m.id} value={m.slug}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {t("quick_booking.date")}
              </span>
              <div className="flex gap-(--space-sm)">
                {dates3.map((d) => (
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
                    {d.weekday} {d.day} {d.month}
                  </button>
                ))}
              </div>
            </div>

            {/* Cinema */}
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
                value={selectedCinemaId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCinemaId(id);
                  setSelectedTime("");
                }}
              >
                {CINEMAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Showtime */}
            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {t("quick_booking.showtime")}
              </span>
              <div className="flex flex-wrap gap-(--space-sm)">
                {availableShowtimes.map((st) => (
                  <button
                    key={st.time}
                    disabled={!st.available}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      !st.available
                        ? "border border-transparent bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed opacity-40"
                        : selectedTime === st.time
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => st.available && setSelectedTime(st.time)}
                    aria-pressed={selectedTime === st.time}
                  >
                    {st.time}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            {canBook ? (
              <Link
                href={`/booking/${selectedMovieSlug}/cinema?cinema=${selectedCinemaId}&time=${selectedTime}&date=${selectedDate}`}
                className="block w-full rounded-(--radius-sm) bg-(--color-gold) py-3 text-center text-sm font-bold tracking-widest text-black transition-opacity hover:opacity-90"
              >
                {t("quick_booking.book")}
              </Link>
            ) : (
              <button
                disabled
                className="w-full rounded-(--radius-sm) bg-(--color-surface) py-3 text-center text-sm font-bold tracking-widest text-(--color-text-muted) border border-(--color-border) cursor-not-allowed"
              >
                {t("quick_booking.book")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
