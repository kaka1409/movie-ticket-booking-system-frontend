"use client";

import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { selectedSeats, ticketPrice } = useBooking();
  const { translate } = useLocale();

  // Cell price straight from the seat map — a sweetbox cell already covers
  // both chairs, unlike the per-chair `seatPrices` table.
  const labels = selectedSeats.map((seat) => seat.label).join(", ");
  const hasSeats = selectedSeats.length > 0;

  return (
    <BookingBottomBar
      selectionInfo={{
        subLabel: labels,
      }}
      totalInfo={{
        label: translate("booking.common.total_price"),
        amount: ticketPrice,
      }}
      canProceed={hasSeats}
      ctaText={translate("booking.seats.continue_snacks")}
      ctaHref={`/booking/${slug}/snack`}
    />
  );
}
