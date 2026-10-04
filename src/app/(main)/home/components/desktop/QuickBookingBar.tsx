"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Clapperboard, Landmark, Calendar, Clock, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import type { Movie } from "@/features/movies/types";
import type { Cinema, DateOption } from "@/features/booking/types";
import type { ErrorResponse } from "@/libs/api";
import SectionFallback from "@/components/ui/SectionFallback";

const STANDARD_TICKET_PRICE = 90000;

interface SelectColProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string; disabled?: boolean }[];
  hint?: string;
}

const SelectCol: React.FC<SelectColProps> = ({ icon, label, value, onChange, options, hint }) => (
  <div className="flex flex-1 flex-col gap-1">
    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-(--color-gold)">
      {icon} {label}
    </span>
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none border-0 border-b border-(--color-border) bg-transparent pb-2 pr-6 pt-2 text-[13px] font-medium text-white outline-none font-sans transition-colors focus:border-(--color-gold)"
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

const Divider = () => <div className="mt-4 w-px self-stretch bg-(--color-border)" />;

export default function QuickBookingBar({
  movies,
  cinemas,
  dates,
  error,
}: {
  movies: Movie[];
  cinemas: Cinema[];
  dates: DateOption[];
  error?: ErrorResponse["error"] | null;
}) {
  const { translate } = useLocale();

  const [movieSlug, setMovieSlug] = useState(movies[0]?.slug ?? "");
  const [cinemaId, setCinemaId] = useState(cinemas[0]?.id ? String(cinemas[0].id) : "");
  const [date, setDate] = useState(dates[0]?.value ?? "");
  const [tickets, setTickets] = useState(2);

  const selectedCinema = useMemo(
    () => cinemas.find((c) => String(c.id) === cinemaId),
    [cinemas, cinemaId],
  );

  const availableShowtimes = useMemo(() => selectedCinema?.showtimes ?? [], [selectedCinema]);

  const [selectedTime, setSelectedTime] = useState(
    availableShowtimes.find((s) => s.available)?.time ?? "",
  );

  // When cinema changes, update selectedTime if current time is not available
  const handleCinemaChange = (newCinemaId: string) => {
    setCinemaId(newCinemaId);
    const newCinema = cinemas.find((c) => String(c.id) === newCinemaId);
    const firstAvailable = newCinema?.showtimes?.find((s) => s.available);
    setSelectedTime(firstAvailable?.time ?? "");
  };

  if (error) return <SectionFallback error={error} />;
  if (movies.length === 0) return null;

  const effectiveMovieSlug = movieSlug || movies[0]?.slug || "";
  const canBook = Boolean(effectiveMovieSlug && cinemaId && date && selectedTime);

  const nextShowtimesHint = availableShowtimes
    .filter((s) => s.available && s.time !== selectedTime)
    .map((s) => s.time)
    .slice(0, 3)
    .join(" · ");

  const bookingUrl = `/booking/${effectiveMovieSlug}/cinema?cinema=${cinemaId}&time=${selectedTime}&date=${date}`;

  return (
    <section
      className="mx-auto max-w-7xl px-8 pt-4 pb-2"
      aria-label={translate("home.desktop.quick_booking_section")}
    >
      <div className="relative z-10 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-7 pb-5 pt-5 shadow-lg">
        <div className="mb-5 flex items-start gap-6">
          {/* Movie Select */}
          <SelectCol
            icon={<Clapperboard size={14} />}
            label={translate("home.quick_booking.select_movie")}
            value={effectiveMovieSlug}
            onChange={setMovieSlug}
            options={movies.map((m) => ({ label: m.title, value: m.slug }))}
          />
          <Divider />

          {/* Cinema Select */}
          <SelectCol
            icon={<Landmark size={14} />}
            label={translate("home.quick_booking.cinema")}
            value={cinemaId}
            onChange={handleCinemaChange}
            options={cinemas.map((c) => ({ label: c.name, value: String(c.id) }))}
          />
          <Divider />

          {/* Date Select */}
          <SelectCol
            icon={<Calendar size={14} />}
            label={translate("home.quick_booking.date")}
            value={date}
            onChange={setDate}
            options={dates.slice(0, 7).map((d) => ({
              label: `${d.weekday} ${d.day} ${d.month}`,
              value: d.value,
            }))}
          />
          <Divider />

          {/* Showtime Select */}
          <SelectCol
            icon={<Clock size={14} />}
            label={translate("home.quick_booking.showtime")}
            value={selectedTime}
            onChange={setSelectedTime}
            options={
              availableShowtimes.length > 0
                ? availableShowtimes.map((s) => ({
                    label: `${s.time} (${s.room})${!s.available ? " - Sold out" : ""}`,
                    value: s.time,
                    disabled: !s.available,
                  }))
                : [{ label: "No showtimes", value: "" }]
            }
            hint={nextShowtimesHint ? `Next: ${nextShowtimesHint}` : undefined}
          />
          <Divider />

          {/* Tickets Stepper */}
          <div className="flex shrink-0 flex-col gap-1">
            <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-(--color-gold)">
              <Ticket size={14} /> {translate("nav.tickets")}
            </span>
            <div className="flex items-center gap-2.5 border-b border-(--color-border) pb-2 pt-1.5">
              <button
                type="button"
                onClick={() => setTickets((prev) => Math.max(1, prev - 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-2) text-sm font-bold text-white transition-colors hover:border-(--color-gold) hover:text-(--color-gold)"
                aria-label={translate("home.desktop.decrease_tickets")}
              >
                −
              </button>
              <span className="min-w-5 text-center text-sm font-bold text-white">{tickets}</span>
              <button
                type="button"
                onClick={() => setTickets((prev) => Math.min(8, prev + 1))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-2) text-sm font-bold text-white transition-colors hover:border-(--color-gold) hover:text-(--color-gold)"
                aria-label={translate("home.desktop.increase_tickets")}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Total & Actions */}
        <div className="flex items-center justify-between border-t border-(--color-border) pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-(--color-text-muted)">
              {translate("home.desktop.estimated_total")}
            </span>
            <span className="text-xl font-black tracking-tight text-(--color-gold)">
              {formatVND(tickets * STANDARD_TICKET_PRICE)}
            </span>
            <span className="text-[11px] text-(--color-text-muted)">
              ({tickets} × {formatVND(STANDARD_TICKET_PRICE)})
            </span>
          </div>

          <div className="flex items-center gap-4">
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
      </div>
    </section>
  );
}
