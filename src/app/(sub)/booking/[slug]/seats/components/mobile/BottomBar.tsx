"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useBooking } from "@/features/booking/context";
import { useSeatHoldSubmit } from "@/features/booking/hooks/useSeatHoldSubmit";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const { translate } = useLocale();
  const { ticketPrice } = useBooking();
  const { labels, hasSeats, isReserving, errorText, submit } = useSeatHoldSubmit();

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
      onCtaClick={submit}
      isLoading={isReserving}
      errorText={errorText}
    />
  );
}
