"use client";

import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import PriceBreakdown from "@/components/shared/PriceBreakdown";

/**
 * The tail of the desktop rail on the last steps: which theater/day the seats
 * are for, then seats → snacks → total. The movie identity above it comes from
 * `BookingRail`, so this stays purely booking-state.
 */
export default function RailSummary() {
  const { translate } = useLocale();
  const { cinemaName, room, date, time, selectedSeats, combos, foods, total } = useBooking();

  const theater = [cinemaName, room].filter(Boolean).join(", ");

  return (
    <>
      <div className="space-y-1">
        <MicroLabel className="text-(--color-text-muted)">
          {translate("booking.common.theater")}
        </MicroLabel>
        <p className="text-sm font-bold text-(--color-text-primary)">{theater || "—"}</p>
        {date && time && (
          <p className="text-xs text-(--color-text-muted)">
            {date} • {time}
          </p>
        )}
      </div>

      <PriceBreakdown seats={selectedSeats} snacks={[...combos, ...foods]} total={total} />
    </>
  );
}
