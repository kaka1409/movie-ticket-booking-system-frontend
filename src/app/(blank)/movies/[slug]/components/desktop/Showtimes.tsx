"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, RotateCcw, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMovieDetail } from "@/features/movies/contexts/MovieDetailContext";
import { useMovieSelection } from "@/features/movies/contexts/MovieSelectionContext";
import { useShowtimes } from "@/features/showtimes/contexts/ShowtimesContext";
import { getRoomDisplayName } from "@/libs/utils";
import { DATE_STRIP_DAYS } from "@/features/showtimes/constants";
import { buildFallbackDateChips, toShowtimeDateChips } from "@/features/showtimes/utils";
import type { GroupedShowtimeCinema, ShowtimeSlot } from "@/features/showtimes/types";

/* Group a cinema's slots by format so 2D / IMAX reads as separate blocks. */
function groupByFormat(slots: ShowtimeSlot[]): [string, ShowtimeSlot[]][] {
  const groups = new Map<string, ShowtimeSlot[]>();

  for (const slot of slots) {
    const key = slot.format || "2D";
    const bucket = groups.get(key);
    if (bucket) bucket.push(slot);
    else groups.set(key, [slot]);
  }

  return Array.from(groups.entries());
}

export default function Showtimes() {
  const { translate, locale } = useLocale();
  const movie = useMovieDetail();
  const { selectedShowtime, setSelectedShowtime } = useMovieSelection();
  const { activeDate, cinemas, error, isPending, dates, today, hasDateOptions, selectDate, retry } =
    useShowtimes();

  const dateChips = useMemo(
    () =>
      dates.length > 0
        ? toShowtimeDateChips(dates, locale)
        : buildFallbackDateChips(today, locale, DATE_STRIP_DAYS),
    [dates, today, locale],
  );

  // A movie with genuinely no showtime days renders no chips at all — just
  // the empty state below. The local fallback chips stay for dates-API
  // failures only, where picking a day can still recover showtimes.
  const showDateStrip = dates.length > 0 || !hasDateOptions;

  const selectTime = (cinema: GroupedShowtimeCinema, showtimeId: string, time: string) => {
    const isSameSlot = selectedShowtime?.showtimeId === showtimeId;
    const next = isSameSlot ? null : { cinemaId: cinema.id, showtimeId, time };

    setSelectedShowtime(next ? { ...next, date: activeDate } : null);
  };

  const bookingHref = (() => {
    if (!selectedShowtime) return null;
    const params = new URLSearchParams({
      showtimeId: selectedShowtime.showtimeId ?? "",
      cinema: String(selectedShowtime.cinemaId),
      time: selectedShowtime.time,
      date: selectedShowtime.date,
    });
    return `/booking/${movie.slug}/cinema?${params.toString()}`;
  })();

  return (
    <div className="sticky top-24" aria-busy={isPending}>
      <div className="overflow-hidden rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card)">
        <div className="border-b border-(--color-border) px-5 pt-5 pb-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-(--color-text-primary)">
            <CalendarDays size={16} className="text-(--color-gold)" />
            {translate("movies.detail.showtimes")}
          </h2>
        </div>

        <div className="space-y-4 p-4">
          {showDateStrip && (
            <div className="flex flex-wrap gap-2">
              {dateChips.map((chip) => {
                const active = chip.value === activeDate;

                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => selectDate(chip.value)}
                    disabled={chip.disabled}
                    aria-pressed={active}
                    className={`flex min-w-13 cursor-pointer flex-col items-center rounded-(--radius-md) border px-3 py-2 text-center transition duration-150 ${
                      active
                        ? "border-(--color-gold) bg-(--color-gold) shadow-(--shadow-glow)"
                        : chip.disabled
                          ? "cursor-not-allowed border-(--color-border) bg-(--color-surface-2) opacity-40"
                          : "border-(--color-border) bg-(--color-surface-2) hover:border-(--color-gold)/40"
                    }`}
                  >
                    <span
                      className={`text-3xs font-black tracking-widest ${
                        active ? "text-black/70" : "text-(--color-text-muted)"
                      }`}
                    >
                      {chip.label}
                    </span>
                    <span
                      className={`text-lg leading-tight font-extrabold ${
                        active ? "text-(--color-bg)" : "text-(--color-text-primary)"
                      }`}
                    >
                      {chip.day}
                    </span>
                    <span
                      className={`text-3xs font-semibold ${
                        active ? "text-black/60" : "text-(--color-text-muted)"
                      }`}
                    >
                      {chip.value === today
                        ? translate("common.today").toUpperCase()
                        : chip.weekday}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-2 rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-4 py-6 text-center">
              <p className="text-xs text-(--color-text-muted)">{error}</p>
              <button
                type="button"
                onClick={retry}
                disabled={isPending}
                className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-(--color-gold) transition-colors hover:text-(--color-gold-light) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={12} /> {translate("common.try_again")}
              </button>
            </div>
          )}

          {!error && cinemas.length === 0 && (
            <p className="rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-4 py-6 text-center text-xs text-(--color-text-muted)">
              {translate("movies.detail.no_showtimes")}
            </p>
          )}

          {!error && cinemas.length > 0 && (
            <div
              className={`space-y-4 transition-opacity duration-200 ${
                isPending ? "pointer-events-none opacity-40" : "opacity-100"
              }`}
            >
              {cinemas.map((cinema) => (
                <div key={cinema.id}>
                  <p className="text-sm font-bold text-(--color-text-primary)">{cinema.name}</p>
                  <p className="mt-0.5 flex items-start gap-1 text-2xs text-(--color-text-muted)">
                    <MapPin size={10} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{cinema.address}</span>
                  </p>

                  {groupByFormat(cinema.showtimes).map(([format, slots]) => (
                    <div key={format} className="mb-2.5 mt-2.5">
                      <p className="mb-1.5 text-3xs font-black tracking-widest text-(--color-text-muted) uppercase">
                        {format}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {slots.map((slot) => {
                          const active = selectedShowtime?.showtimeId === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              title={getRoomDisplayName(
                                { name: slot.roomName, nameVi: slot.roomNameVi },
                                locale,
                              )}
                              onClick={() => selectTime(cinema, slot.id, slot.startTime)}
                              disabled={!slot.isAvailable}
                              aria-pressed={active}
                              className={`rounded-(--radius-sm) border px-3 py-1.5 text-xs font-semibold transition duration-150 active:scale-[0.96] ${
                                active
                                  ? "border-(--color-gold) bg-(--color-gold) text-(--color-bg) shadow-(--shadow-glow)"
                                  : !slot.isAvailable
                                    ? "cursor-not-allowed border-(--color-border) text-(--color-text-muted) line-through opacity-50"
                                    : "cursor-pointer border-(--color-border) bg-(--color-surface-2) text-(--color-text-primary) hover:border-(--color-gold)/40"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 h-px bg-(--color-border)" />
                </div>
              ))}
            </div>
          )}

          {bookingHref ? (
            <Link
              href={bookingHref}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-(--radius-md) bg-(--color-gold) py-3.5 text-sm font-bold text-(--color-bg) no-underline shadow-(--shadow-glow) transition duration-150 hover:bg-(--color-gold-dark) active:scale-[0.98]"
            >
              <Ticket size={15} />
              {translate("movies.detail.book_showtime").replace(
                "{time}",
                selectedShowtime?.time ?? "",
              )}
            </Link>
          ) : (
            <span className="flex w-full cursor-default items-center justify-center gap-2 rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) py-3.5 text-sm font-bold text-(--color-text-muted)">
              <Ticket size={15} />
              {translate("movies.detail.select_showtime")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
