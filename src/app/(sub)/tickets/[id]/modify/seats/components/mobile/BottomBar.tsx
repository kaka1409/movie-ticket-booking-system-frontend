"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { translate } = useLocale();
  const { selectedSeats, originalSeatCount } = useModification();
  const [isLoading, setIsLoading] = useState(false);

  // The server rejects a swap unless it covers the same number of seats as the
  // booking, so the CTA stays shut until the pick matches exactly (a SweetBox
  // cell carries two seat ids and therefore counts as two).
  const requiredSeatCount = originalSeatCount ?? 0;
  const selectedSeatCount = selectedSeats.reduce((total, seat) => total + seat.seatIds.length, 0);
  const hasExactCount = requiredSeatCount > 0 && selectedSeatCount === requiredSeatCount;

  const hintText =
    selectedSeatCount === 0
      ? translate("tickets.modify.seats.select_prompt")
      : hasExactCount
        ? translate("tickets.modify.seats.selected").replace("{count}", String(selectedSeatCount))
        : translate("tickets.modify.seats.exact_count").replace(
            "{count}",
            String(requiredSeatCount),
          );

  const handleContinue = async () => {
    if (!hasExactCount || isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.push(`/tickets/${id}/modify/review`);
  };

  return (
    <BookingBottomBar
      hintText={hintText}
      canProceed={hasExactCount}
      ctaText={
        isLoading ? translate("booking.payment.processing") : translate("tickets.transfer.continue")
      }
      isLoading={isLoading}
      onCtaClick={() => void handleContinue()}
    />
  );
}
