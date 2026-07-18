"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { Cinema, DateOption } from "@/features/booking/types";

export default function QuickBooking({
  movies,
  cinemas,
  dates,
}: {
  movies: Movie[];
  cinemas: Cinema[];
  dates: DateOption[];
}) {
  const { translate } = useLocale();

  const [selectedMovieSlug, setSelectedMovieSlug] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState(cinemas[0]?.id ?? 0);
  const [selectedDate, setSelectedDate] = useState(dates[0]?.value ?? "");
  const [selectedTime, setSelectedTime] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  if (movies.length === 0) return null;

  const effectiveMovieSlug = selectedMovieSlug || movies[0].slug;

  const selectedCinema = useMemo(
    () => cinemas.find((cinema) => cinema.id === selectedCinemaId),
    [cinemas, selectedCinemaId]
  );

  const availableShowtimes = useMemo(
    () => selectedCinema?.showtimes ?? [],
    [selectedCinema]
  );

  const firstThreeDates = dates.slice(0, 3);

  const canBook = !!effectiveMovieSlug && !!selectedCinemaId && !!selectedDate && !!selectedTime;

  return (
    <section
      className="mx-(--space-md) rounded-(--radius-sm) p-(--space-md) bg-(--color-surface)"
      aria-labelledby="qb-heading"
    >
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setIsExpanded((previousValue) => !previousValue)}
        aria-expanded={isExpanded}
      >
        <h2 id="qb-heading" className="text-lg font-bold text-(--color-gold)">
          {translate("home.quick_booking.title")}
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
                {translate("home.quick_booking.select_movie")}
              </label>
              <select
                id="qb-movie"
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border)"
                value={effectiveMovieSlug}
                onChange={(event) => setSelectedMovieSlug(event.target.value)}
              >
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.slug}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {translate("home.quick_booking.date")}
              </span>
              <div className="flex gap-(--space-sm)">
                {firstThreeDates.map((dateOption) => (
                  <button
                    key={dateOption.value}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      selectedDate === dateOption.value
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => setSelectedDate(dateOption.value)}
                    aria-pressed={selectedDate === dateOption.value}
                  >
                    {dateOption.weekday} {dateOption.day} {dateOption.month}
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
                {translate("home.quick_booking.cinema")}
              </label>
              <select
                id="qb-cinema"
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border)"
                value={selectedCinemaId}
                onChange={(event) => {
                  const cinemaId = Number(event.target.value);
                  setSelectedCinemaId(cinemaId);
                  setSelectedTime("");
                }}
              >
                {cinemas.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Showtime */}
            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {translate("home.quick_booking.showtime")}
              </span>
              <div className="flex flex-wrap gap-(--space-sm)">
                {availableShowtimes.map((showtime) => (
                  <button
                    key={showtime.time}
                    disabled={!showtime.available}
                    className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                      !showtime.available
                        ? "border border-transparent bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed opacity-40"
                        : selectedTime === showtime.time
                        ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                        : "border border-transparent bg-(--color-surface) text-white"
                    }`}
                    onClick={() => showtime.available && setSelectedTime(showtime.time)}
                    aria-pressed={selectedTime === showtime.time}
                  >
                    {showtime.time}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            {canBook ? (
              <Link
                href={`/booking/${effectiveMovieSlug}/cinema?cinema=${selectedCinemaId}&time=${selectedTime}&date=${selectedDate}`}
                className="block w-full rounded-(--radius-sm) bg-(--color-gold) py-3 text-center text-sm font-bold tracking-widest text-black transition-opacity hover:opacity-90"
              >
                {translate("home.quick_booking.book")}
              </Link>
            ) : (
              <button
                disabled
                className="w-full rounded-(--radius-sm) bg-(--color-surface) py-3 text-center text-sm font-bold tracking-widest text-(--color-text-muted) border border-(--color-border) cursor-not-allowed"
              >
                {translate("home.quick_booking.book")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
