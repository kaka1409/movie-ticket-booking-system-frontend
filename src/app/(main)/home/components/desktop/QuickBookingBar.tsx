"use client";

import Link from "next/link";
import { ChevronDown, Clapperboard, Landmark, Calendar, Clock, RotateCcw } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Movie } from "@/features/movies/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";
import { useQuickBookingContext } from "../QuickBookingProvider";

interface SelectColProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-(--color-surface) text-white"
          >
            {option.label}
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
 * Desktop quick ticket finder. The dates/cinemas/slots controller is shared with
 * the mobile widget through `QuickBookingProvider` — this file only paints it.
 */
export default function QuickBookingBar({
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

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const nextShowtimesHint = slots
    .filter((slot) => slot.isAvailable && slot.id !== selectedSlotId)
    .map((slot) => slot.startTime)
    .slice(0, 3)
    .join(" · ");

  return (
    <section
      className="mx-auto max-w-7xl px-8 pt-4 pb-2"
      aria-label={translate("home.desktop.quick_booking_section")}
    >
      <div className="relative z-10 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-7 pb-5 pt-5 shadow-lg">
        <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-4 lg:flex lg:items-start">
          <SelectCol
            icon={<Clapperboard size={14} />}
            label={translate("home.quick_booking.select_movie")}
            value={effectiveMovieSlug}
            onChange={selectMovie}
            options={movies.map((movie) => ({ label: movie.title, value: movie.slug }))}
          />
          <Divider />

          <SelectCol
            icon={<Landmark size={14} />}
            label={translate("home.quick_booking.cinema")}
            value={selectedCinemaId}
            onChange={selectCinema}
            disabled={shownCinemas === null}
            options={
              shownCinemas === null
                ? [{ label: "…", value: "" }]
                : shownCinemas.map((cinema) => ({ label: cinema.name, value: cinema.id }))
            }
          />
          <Divider />

          <SelectCol
            icon={<Calendar size={14} />}
            label={translate("home.quick_booking.date")}
            value={activeDate}
            onChange={selectDate}
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

          <SelectCol
            icon={<Clock size={14} />}
            label={translate("home.quick_booking.showtime")}
            value={selectedSlotId}
            onChange={selectSlot}
            disabled={shownCinemas === null}
            options={
              shownCinemas === null
                ? [{ label: "…", value: "" }]
                : slots.length > 0
                  ? slots.map((slot) => ({
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--color-border) pt-4">
          <Link
            href="/movies"
            className="text-xs font-semibold text-(--color-text-secondary) underline underline-offset-4 transition-colors hover:text-(--color-gold)"
          >
            {translate("home.desktop.view_schedule")}
          </Link>

          {canBook ? (
            <Link
              href={`/booking/${effectiveMovieSlug}/cinema?showtimeId=${selectedSlotId}`}
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
