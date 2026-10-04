"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import type { Movie } from "@/features/movies/types";

export default function OrderSummary({ movie }: { movie: Movie }) {
  const { translate } = useLocale();
  const { cinemaName, room, location, date, time, selectedSeats, combos, foods, total } =
    useBooking();

  return (
    <div className="mx-4 rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-visible">
      <div className="px-4 pt-3 pb-2">
        <p className="text-[9px] font-black tracking-[0.18em] uppercase text-(--color-text-muted)">
          {translate("booking.common.order_summary")}
        </p>
      </div>

      {/* Movie info */}
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
            <p className="text-xs text-(--color-text-muted)">
              {movie?.genre} • {movie?.duration} min
            </p>
          </div>
        </div>
        {movie?.ageRating && (
          <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-(--color-border) text-(--color-text-secondary) bg-(--color-surface-2)">
            {movie.ageRating}
          </span>
        )}
      </div>

      {/* Tear line */}
      <TearLine className="px-0 my-0" lineClassName="mx-3" />

      {/* Booking details */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between gap-4">
          <DetailRow
            icon={MonitorPlay}
            label={translate("booking.common.theater")}
            value={
              <>
                {cinemaName || "—"}
                {room && <>, {room}</>}
                {location && <>, {location}</>}
              </>
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={date && time ? `${date} • ${time}` : "—"}
            valueClass="text-white font-bold text-sm text-right"
            labelClass="justify-end"
          />
        </div>

        {/* Seats → snacks → total */}
        <PriceBreakdown seats={selectedSeats} snacks={[...combos, ...foods]} total={total} />
      </div>
    </div>
  );
}
