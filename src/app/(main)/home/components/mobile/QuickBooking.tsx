"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { GroupedShowtimeCinema, ShowtimeDateOption } from "@/features/showtimes/types";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import { toShowtimeDateChips } from "@/features/showtimes/utils";
import type { ErrorResponse } from "@/libs/api";
import { formatDateOnly } from "@/libs/date";
import SectionFallback from "@/components/ui/SectionFallback";

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
 * Quick ticket finder — live data all the way down: dates come from
 * `GET /showtimes/dates` for the picked movie, slots from
 * `GET /showtimes?movieSlug&date`, cinemas are whatever plays that day.
 * Fetched lists are keyed by their request (movie+locale / movie+date), so a
 * slow response can never overwrite a newer one and no synchronous reset
 * effect is needed; the CTA carries the exact `showtimeId` instead of a
 * matchable time string.
 */
export default function QuickBooking({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate, locale } = useLocale();
  const today = useMemo(() => formatDateOnly(new Date()), []);

  const [selectedMovieSlug, setSelectedMovieSlug] = useState("");
  const [datesState, setDatesState] = useState<{
    key: string;
    data: ShowtimeDateOption[];
  } | null>(null);
  const [datesFailedKey, setDatesFailedKey] = useState<string | null>(null);
  const [dateSel, setDateSel] = useState<{ key: string; value: string } | null>(null);
  const [slotsState, setSlotsState] = useState<{
    key: string;
    data: GroupedShowtimeCinema[];
  } | null>(null);
  const [slotsFailedKey, setSlotsFailedKey] = useState<string | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);

  // A previously picked slug that left the list falls back to the first movie.
  const effectiveMovieSlug =
    selectedMovieSlug && movies.some((movie) => movie.slug === selectedMovieSlug)
      ? selectedMovieSlug
      : (movies[0]?.slug ?? "");

  const datesKey = `${effectiveMovieSlug}|${locale}|${retryNonce}`;
  const shownDates = datesState && datesState.key === datesKey ? datesState.data : null;
  const datesFailed = datesFailedKey === datesKey;
  const activeDate = dateSel && dateSel.key === datesKey ? dateSel.value : "";

  const slotsKey = `${effectiveMovieSlug}|${activeDate}|${retryNonce}`;
  const shownCinemas = slotsState && slotsState.key === slotsKey ? slotsState.data : null;
  const slotsFailed = slotsFailedKey === slotsKey;

  // Dates follow the movie (and the UI language for weekday labels).
  useEffect(() => {
    if (!effectiveMovieSlug) return;
    let cancelled = false;

    void (async () => {
      const result = await getShowtimeDates(effectiveMovieSlug, locale);
      if (cancelled) return;
      if ("error" in result) {
        setDatesFailedKey(datesKey);
        return;
      }
      setDatesState({ key: datesKey, data: result.data });
      // Functional update (no dateSel dep → no refetch loop): keep the picked
      // day when it still shows, otherwise fall back to the first one.
      setDateSel((previous) => {
        const first = result.data.find((option) => option.hasShowtimes) ?? result.data[0];
        const nextValue =
          previous &&
          result.data.some((option) => option.date === previous.value && option.hasShowtimes)
            ? previous.value
            : (first?.date ?? "");
        if (!nextValue || (previous && previous.key === datesKey && previous.value === nextValue))
          return previous;
        return { key: datesKey, value: nextValue };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [datesKey, effectiveMovieSlug, locale]);

  // Slots follow the date; the cinema list is whatever plays that day.
  useEffect(() => {
    if (!effectiveMovieSlug || !activeDate) return;
    let cancelled = false;

    void (async () => {
      const result = await getShowtimes(effectiveMovieSlug, activeDate);
      if (cancelled) return;
      if ("error" in result) {
        setSlotsFailedKey(slotsKey);
        return;
      }
      const list = result.data.cinemas;
      setSlotsState({ key: slotsKey, data: list });
      setSelectedCinemaId((previous) => {
        if (previous && list.some((cinema) => cinema.id === previous)) return previous;
        const withAvailability =
          list.find((cinema) => cinema.showtimes.some((slot) => slot.isAvailable)) ?? list[0];
        return withAvailability ? withAvailability.id : "";
      });
      setSelectedSlotId((previous) =>
        previous &&
        list.some((cinema) =>
          cinema.showtimes.some((slot) => slot.id === previous && slot.isAvailable),
        )
          ? previous
          : "",
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [slotsKey, effectiveMovieSlug, activeDate]);

  const dateChips = useMemo(
    () => (shownDates ? toShowtimeDateChips(shownDates, locale) : []),
    [shownDates, locale],
  );
  const selectedCinema = useMemo(
    () => shownCinemas?.find((cinema) => cinema.id === selectedCinemaId),
    [shownCinemas, selectedCinemaId],
  );
  const slots = selectedCinema?.showtimes ?? [];
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const canBook = !!effectiveMovieSlug && !!selectedSlot && selectedSlot.isAvailable;

  if (error) return <SectionFallback error={error} />;

  if (movies.length === 0) return null;

  const retry = () => setRetryNonce((nonce) => nonce + 1);

  return (
    <section
      className="mx-(--space-md) rounded-(--radius-sm) p-(--space-md) bg-(--color-surface)"
      aria-labelledby="qb-heading"
    >
      <button
        type="button"
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
                onChange={(event) => {
                  setSelectedMovieSlug(event.target.value);
                  setSelectedCinemaId("");
                  setSelectedSlotId("");
                }}
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
                      onClick={() => {
                        setDateSel({ key: datesKey, value: chip.value });
                        setSelectedSlotId("");
                      }}
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
                className="w-full rounded-(--radius-sm) bg-(--color-surface) px-3 py-2.5 text-sm text-white outline-none border border-(--color-border) disabled:opacity-40"
                value={selectedCinemaId}
                disabled={shownCinemas === null}
                onChange={(event) => {
                  setSelectedCinemaId(event.target.value);
                  setSelectedSlotId("");
                }}
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

            {/* Showtime */}
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
                      onClick={() => slot.isAvailable && setSelectedSlotId(slot.id)}
                      aria-pressed={selectedSlotId === slot.id}
                      title={slot.roomName}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            {canBook && selectedSlot ? (
              <Link
                href={`/booking/${effectiveMovieSlug}/cinema?showtimeId=${selectedSlot.id}`}
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
