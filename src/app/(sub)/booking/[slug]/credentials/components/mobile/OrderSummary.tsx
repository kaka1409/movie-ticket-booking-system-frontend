"use client";

import Image from "next/image";
import { MonitorPlay, CalendarDays } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";

export default function OrderSummary() {
  const { translate } = useLocale();
  const { movie, cinemaName, room, location, date, time, selectedSeats, combos, foods, total } =
    useBooking();

  return (
    <div className="px-4 space-y-3">
      <h2 className="font-bold text-lg text-white">{translate("booking.common.ticket_details")}</h2>

      <div className="rounded-2xl bg-(--color-surface) border border-(--color-border) overflow-visible">
        {/* Movie info */}
        <div className="flex gap-3 p-4">
          {movie?.src && (
            <div className="relative w-16 h-24 flex-shrink-0 rounded-sm overflow-hidden bg-(--color-surface-2)">
              <Image src={movie.src} alt={movie.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-base text-white leading-snug mb-1">
              {movie?.title ?? "—"}
            </h3>
            {movie && (
              <p className="text-xs text-(--color-text-secondary)">
                {movie.genre} • {movie.duration} {translate("booking.min")}
              </p>
            )}
          </div>
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
    </div>
  );
}
