"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { formatShowtimeWallClock } from "@/libs/date";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";

/**
 * The order recap on the credentials and payment steps. Both steps read the
 * same booking draft, so they share one card — a reader who walks forward must
 * not see the summary change shape between two adjacent steps.
 */
export default function OrderSummary() {
  const { translate, locale } = useLocale();
  const { movie, cinemaName, room, location, date, time, selectedSeats, combos, foods, total } =
    useBooking();

  return (
    <div className="mx-4 rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-visible">
      <div className="px-4 pt-3 pb-2">
        <p className="text-3xs font-black tracking-[0.18em] uppercase text-(--color-text-muted)">
          {translate("booking.common.ticket_details")}
        </p>
      </div>

      <div className="flex items-start justify-between gap-3 px-4 pb-4">
        <div className="flex gap-3">
          {movie?.src && (
            <div className="relative w-12 h-18 flex-shrink-0 rounded-sm overflow-hidden bg-(--color-surface-2)">
              <Image src={movie.src} alt={movie.title} fill className="object-cover" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-base text-(--color-text-primary) leading-snug mb-1">
              {movie?.title ?? "—"}
            </h3>
            {movie && (
              <p className="text-xs text-(--color-text-muted)">
                {movie.genre} • {movie.duration} {translate("booking.min")}
              </p>
            )}
          </div>
        </div>
        {movie?.ageRating && (
          <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-2xs font-bold border border-(--color-border) text-(--color-text-secondary) bg-(--color-surface-2)">
            {movie.ageRating}
          </span>
        )}
      </div>

      <TearLine className="px-0 my-0" lineClassName="mx-3" />

      <div className="px-4 py-4 space-y-4">
        {/* Venue takes the leftover width (a long name wraps); the clock keeps its
            natural width so the date never breaks — same block as the ticket page. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <DetailRow
            icon={MonitorPlay}
            label={translate("booking.common.theater")}
            value={
              <>
                {cinemaName || "—"}
                {location && <>, {location}</>}
                {room && <>, {room}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={date && time ? formatShowtimeWallClock(date, time, locale) : "—"}
            valueClass="text-white font-bold text-sm text-right whitespace-nowrap"
            labelClass="justify-end"
          />
        </div>

        <PriceBreakdown seats={selectedSeats} snacks={[...combos, ...foods]} total={total} />
      </div>
    </div>
  );
}
