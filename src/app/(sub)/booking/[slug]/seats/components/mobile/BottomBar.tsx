"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { putSeatHolds } from "@/features/booking/api";
import { recoverSeatMap } from "@/features/booking/utils/seatMap";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { token } = useAuth();
  const { selectedSeats, ticketPrice, showtimeId, setSeatGrid, setHoldExpiresAt, startCountdown } =
    useBooking();
  const { translate } = useLocale();

  const [isReserving, setIsReserving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Cell price straight from the seat map — a sweetbox cell already covers
  // both chairs, unlike the per-chair `seatPrices` table.
  const labels = selectedSeats.map((seat) => seat.label).join(", ");
  const seatIds = selectedSeats.flatMap((seat) => seat.seatIds);
  const hasSeats = selectedSeats.length > 0;

  /**
   * The hold (and therefore the countdown) starts HERE, not on seat selection:
   * picking seats touches no backend state, and this CTA is the point where the
   * user commits. Success adopts the server deadline and advances the step;
   * a 409 refetches the map so stolen cells turn `occupied` while survivors
   * stay selected for the retry.
   */
  const handleReserve = async () => {
    if (isReserving || !token || !showtimeId || seatIds.length === 0) return;

    setIsReserving(true);
    setErrorText(null);

    const result = await putSeatHolds(showtimeId, seatIds, token);
    if ("error" in result) {
      if (result.error.status === 409 || result.error.code === "SEAT_TAKEN") {
        await recoverSeatMap(showtimeId, seatIds, setSeatGrid);
        setErrorText(translate("booking.seats.hold_taken"));
      } else {
        setErrorText(translate("booking.seats.hold_failed"));
      }
      setIsReserving(false);
      return;
    }

    setHoldExpiresAt(Date.parse(result.data.expiresAt));
    startCountdown();
    router.push(`/booking/${slug}/snack`);
  };

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
      onCtaClick={handleReserve}
      isLoading={isReserving}
      errorText={errorText}
    />
  );
}
