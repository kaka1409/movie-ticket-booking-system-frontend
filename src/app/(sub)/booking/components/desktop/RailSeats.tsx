"use client";

import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * The seats picked at step 2, repeated on the rail so later steps never lose
 * sight of what is being paid for.
 *
 * The count is chairs, not cells: a sweetbox cell covers two seats, so it adds
 * `seatIds.length` rather than 1.
 */
export default function RailSeats() {
  const { translate } = useLocale();
  const { selectedSeats } = useBooking();

  const seatCount = selectedSeats.reduce(
    (total, seat) => total + Math.max(seat.seatIds.length, 1),
    0,
  );
  const labels = selectedSeats.map((seat) => seat.label).join(", ");

  return (
    <div>
      <MicroLabel className="text-(--color-text-muted)">
        {translate("booking.common.seats")} ({seatCount})
      </MicroLabel>
      <p className="mt-1 text-sm leading-snug font-bold text-(--color-text-primary)">
        {labels || "—"}
      </p>
    </div>
  );
}
