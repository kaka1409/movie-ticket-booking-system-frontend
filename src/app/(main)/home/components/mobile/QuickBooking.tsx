"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { useQuickBookingContext } from "../QuickBookingProvider";

/** Small inline failure with retry — used per dependent block, not full-section. */
function InlineError({ onRetry }: { onRetry: () => void }) {
  const { translate } = useLocale();
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-(--color-text-muted)">{translate("common.error")}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1 text-xs font-bold text-(--color-gold)"
      >
        <RotateCcw size={12} /> {translate("common.try_again")}
      </button>
    </div>
  );
}

/**
 * Mobile quick ticket finder. The dates/cinemas/slots controller is shared with
 * the desktop bar through `QuickBookingProvider` — this file only paints it.
 */
export default function QuickBooking({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate } = useLocale();
  const {
    today,
    effectiveMovieSlug,
    selectMovie,
    shownDates,
    dateChips,
    activeDate,
    selectDate,
    datesFailed,
    shownCinemas,
    selectedCinemaId,
    selectCinema,
    slots,
    selectedSlotId,
    selectSlot,
    slotsFailed,
    retry,
    canBook,
  } = useQuickBookingContext();

  const [isExpanded, setIsExpanded] = useState(true);

  if (error) return <SectionFallback error={error} />;

  if (movies.length === 0) return null;

  return (
    <section
      className="mx-(--space-md) rounded-(--radius-sm) p-(--space-md) bg-(--color-surface)"
      aria-labelledby="qb-heading"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() => setIsExpanded((previous) => !previous)}
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
                onChange={(event) => selectMovie(event.target.value)}
              >
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.slug}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {translate("home.quick_booking.date")}
              </span>
              {datesFailed ? (
                <InlineError onRetry={retry} />
              ) : shownDates === null ? (
                <div className="flex gap-(--space-sm)" aria-hidden>
                  {[0, 1, 2].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs bg-(--color-surface-2) opacity-40"
                    >
                      …
                    </div>
                  ))}
                </div>
              ) : shownDates.length === 0 ? (
                <p className="text-xs text-(--color-text-muted)">
                  {translate("movies.detail.no_showtimes")}
                </p>
              ) : (
                <div className="flex gap-(--space-sm) overflow-x-auto scrollbar-hide pb-1">
                  {dateChips.map((chip) => (
                    <button
                      type="button"
                      key={chip.value}
                      disabled={chip.disabled}
                      className={`shrink-0 rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                        activeDate === chip.value
                          ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                          : chip.disabled
                            ? "border border-transparent bg-transparent text-(--color-text-muted) line-through opacity-40 cursor-not-allowed"
                            : "border border-transparent bg-(--color-surface) text-white"
                      }`}
                      onClick={() => selectDate(chip.value)}
                      aria-pressed={activeDate === chip.value}
                    >
                      {chip.value === today
                        ? translate("common.today").toUpperCase()
                        : chip.weekday}{" "}
                      {chip.day} {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)"
                htmlFor="qb-cinema"
              >
                {translate("home.quick_booking.cinema")}
              </label>
              <select
                id="qb-cinema"
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border) disabled:opacity-40"
                value={selectedCinemaId}
                disabled={shownCinemas === null}
                onChange={(event) => selectCinema(event.target.value)}
              >
                {shownCinemas === null ? (
                  <option value="">…</option>
                ) : (
                  shownCinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <span className="mb-(--space-xs) block text-xs font-semibold text-(--color-text-secondary)">
                {translate("home.quick_booking.showtime")}
              </span>
              {slotsFailed ? (
                <InlineError onRetry={retry} />
              ) : shownCinemas === null ? (
                <div className="flex flex-wrap gap-(--space-sm)" aria-hidden>
                  {[0, 1, 2].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs bg-(--color-surface-2) opacity-40"
                    >
                      …
                    </div>
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="text-xs text-(--color-text-muted)">
                  {translate("movies.detail.no_showtimes")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-(--space-sm)">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      className={`rounded-(--radius-sm) px-(--space-md) py-1.5 text-xs font-semibold transition-colors ${
                        !slot.isAvailable
                          ? "border border-transparent bg-(--color-surface) text-(--color-text-muted) cursor-not-allowed opacity-40"
                          : selectedSlotId === slot.id
                            ? "border border-(--color-gold) bg-(--color-bg) text-(--color-gold)"
                            : "border border-transparent bg-(--color-surface) text-white"
                      }`}
                      onClick={() => slot.isAvailable && selectSlot(slot.id)}
                      aria-pressed={selectedSlotId === slot.id}
                      title={slot.roomName}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {canBook ? (
              <Link
                href={`/booking/${effectiveMovieSlug}/cinema?showtimeId=${selectedSlotId}`}
                className="block w-full rounded-(--radius-sm) bg-(--color-gold) py-3 text-center text-sm font-bold tracking-widest text-black transition-opacity hover:opacity-90"
              >
                {translate("home.quick_booking.book")}
              </Link>
            ) : (
              <button
                type="button"
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
