"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Clapperboard, Landmark, Calendar, Clock, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { GroupedShowtimeCinema, ShowtimeDateOption } from "@/features/showtimes/types";
import { getShowtimeDates, getShowtimes } from "@/features/showtimes/api";
import { toShowtimeDateChips } from "@/features/showtimes/utils";
import type { ErrorResponse } from "@/libs/api";
import { formatDateOnly } from "@/libs/date";
import SectionFallback from "@/components/ui/SectionFallback";

interface SelectColProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string; disabled?: boolean }[];
  hint?: string;
  disabled?: boolean;
}

const SelectCol: React.FC<SelectColProps> = ({
  icon,
  label,
  value,
  onChange,
  options,
  hint,
  disabled,
}) => (
  <div className="flex flex-1 flex-col gap-1 min-w-0">
    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-(--color-gold)">
      {icon} {label}
    </span>
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full cursor-pointer appearance-none border-0 border-b border-(--color-border) bg-transparent pb-2 pr-6 pt-2 text-[13px] font-medium text-white outline-none font-sans transition-colors focus:border-(--color-gold) disabled:opacity-40"
      >
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            disabled={o.disabled}
            className="bg-(--color-surface) text-white"
          >
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
        <ChevronDown size={14} />
      </span>
    </div>
    {hint && <span className="text-[10px] text-(--color-text-muted) truncate">{hint}</span>}
  </div>
);

const Divider = () => (
  <div className="mt-4 hidden w-px self-stretch bg-(--color-border) lg:block" />
);

/**
 * Desktop quick ticket finder — same live data flow as mobile `QuickBooking`:
 * dates from `GET /showtimes/dates` for the picked movie, slots from
 * `GET /showtimes?movieSlug&date`, cinemas are whatever plays that day.
 * Fetched lists are keyed by their request (movie+locale / movie+date), so a
 * slow response can never overwrite a newer one; the CTA carries the exact
 * `showtimeId`.
 */
export default function QuickBookingBar({
  movies,
  error,
}: {
  movies: Movie[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate, locale } = useLocale();
  const today = useMemo(() => formatDateOnly(new Date()), []);

  const [movieSlug, setMovieSlug] = useState("");
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
  const [cinemaId, setCinemaId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);

  const effectiveMovieSlug =
    movieSlug && movies.some((movie) => movie.slug === movieSlug)
      ? movieSlug
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
      setCinemaId((previous) => {
        if (previous && list.some((cinema) => cinema.id === previous)) return previous;
        const withAvailability =
          list.find((cinema) => cinema.showtimes.some((slot) => slot.isAvailable)) ?? list[0];
        return withAvailability ? withAvailability.id : "";
      });
      setSlotId((previous) =>
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
    () => shownCinemas?.find((cinema) => cinema.id === cinemaId),
    [shownCinemas, cinemaId],
  );
  const availableShowtimes = selectedCinema?.showtimes ?? [];
  const selectedSlot = availableShowtimes.find((slot) => slot.id === slotId);
  const canBook = !!effectiveMovieSlug && !!selectedSlot && selectedSlot.isAvailable;

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const nextShowtimesHint = availableShowtimes
    .filter((slot) => slot.isAvailable && slot.id !== slotId)
    .map((slot) => slot.startTime)
    .slice(0, 3)
    .join(" · ");

  const bookingUrl = `/booking/${effectiveMovieSlug}/cinema?showtimeId=${slotId}`;
  const retry = () => setRetryNonce((nonce) => nonce + 1);

  return (
    <section
      className="mx-auto max-w-7xl px-8 pt-4 pb-2"
      aria-label={translate("home.desktop.quick_booking_section")}
    >
      <div className="relative z-10 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-7 pb-5 pt-5 shadow-lg">
        <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-4 lg:flex lg:items-start">
          {/* Movie Select */}
          <SelectCol
            icon={<Clapperboard size={14} />}
            label={translate("home.quick_booking.select_movie")}
            value={effectiveMovieSlug}
            onChange={(nextSlug) => {
              setMovieSlug(nextSlug);
              setCinemaId("");
              setSlotId("");
            }}
            options={movies.map((m) => ({ label: m.title, value: m.slug }))}
          />
          <Divider />

          {/* Cinema Select */}
          <SelectCol
            icon={<Landmark size={14} />}
            label={translate("home.quick_booking.cinema")}
            value={cinemaId}
            onChange={(nextCinemaId) => {
              setCinemaId(nextCinemaId);
              setSlotId("");
            }}
            disabled={shownCinemas === null}
            options={
              shownCinemas === null
                ? [{ label: "…", value: "" }]
                : shownCinemas.map((c) => ({ label: c.name, value: c.id }))
            }
          />
          <Divider />

          {/* Date Select */}
          <SelectCol
            icon={<Calendar size={14} />}
            label={translate("home.quick_booking.date")}
            value={activeDate}
            onChange={(nextDate) => {
              setDateSel({ key: datesKey, value: nextDate });
              setSlotId("");
            }}
            disabled={shownDates === null}
            options={
              shownDates === null
                ? [{ label: "…", value: "" }]
                : dateChips.map((chip) => ({
                    label: `${chip.value === today ? translate("common.today").toUpperCase() : chip.weekday} ${chip.day} ${chip.label}`,
                    value: chip.value,
                    disabled: chip.disabled,
                  }))
            }
          />
          <Divider />

          {/* Showtime Select */}
          <SelectCol
            icon={<Clock size={14} />}
            label={translate("home.quick_booking.showtime")}
            value={slotId}
            onChange={setSlotId}
            disabled={shownCinemas === null}
            options={
              shownCinemas === null
                ? [{ label: "…", value: "" }]
                : availableShowtimes.length > 0
                  ? availableShowtimes.map((slot) => ({
                      label: `${slot.startTime} (${slot.roomName})${!slot.isAvailable ? ` - ${translate("home.quick_booking.sold_out")}` : ""}`,
                      value: slot.id,
                      disabled: !slot.isAvailable,
                    }))
                  : [{ label: translate("movies.detail.no_showtimes"), value: "" }]
            }
            hint={nextShowtimesHint ? `Next: ${nextShowtimesHint}` : undefined}
          />
        </div>

        {(datesFailed || slotsFailed) && (
          <div className="mb-4 flex items-center gap-2">
            <p className="text-xs text-(--color-text-muted)">{translate("common.error")}</p>
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-1 text-xs font-bold text-(--color-gold)"
            >
              <RotateCcw size={12} /> {translate("common.try_again")}
            </button>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-border) pt-4">
          <Link
            href="/movies"
            className="text-xs font-semibold text-(--color-text-secondary) underline underline-offset-4 transition-colors hover:text-(--color-gold)"
          >
            {translate("home.desktop.view_schedule")}
          </Link>

          {canBook ? (
            <Link
              href={bookingUrl}
              className="cursor-pointer whitespace-nowrap rounded-(--radius-md) bg-(--color-gold) px-6 py-2.5 text-[13px] font-extrabold tracking-wide text-black no-underline transition-all hover:bg-(--color-gold-light) hover:scale-102"
            >
              {translate("home.desktop.quick_book_now")}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed whitespace-nowrap rounded-(--radius-md) border border-(--color-border) bg-(--color-surface-2) px-6 py-2.5 text-[13px] font-bold text-(--color-text-muted)"
            >
              {translate("home.desktop.quick_book_now")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
