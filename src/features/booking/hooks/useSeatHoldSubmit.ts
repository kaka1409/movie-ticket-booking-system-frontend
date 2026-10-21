"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { saveSeatHolds } from "@/features/booking/api";
import { recoverSeatMap } from "@/features/booking/utils/seatMap";

interface SeatHoldSubmitResult {
  /** Selected seat labels, comma-joined — the CTA's selection summary. */
  labels: string;
  /** At least one cell is selected, so the CTA may be enabled. */
  hasSeats: boolean;
  isReserving: boolean;
  errorText: string | null;
  submit: () => Promise<void>;
}

/**
 * Seats-step CTA controller — shared by the mobile bottom bar and the desktop
 * summary rail, so the network side lives in exactly one place.
 *
 * The hold (and therefore the countdown) starts HERE, not on seat selection:
 * picking seats touches no backend state and this CTA is the point where the
 * user commits. Success adopts the server deadline and advances the step; a
 * 409 refetches the map so the stolen cells turn `occupied` while the survivors
 * stay selected for the retry.
 */
export function useSeatHoldSubmit(): SeatHoldSubmitResult {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { selectedSeats, showtimeId, setSeatGrid, setHoldExpiresAt, startCountdown } = useBooking();
  const { translate } = useLocale();

  const [isReserving, setIsReserving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const slug = params.slug as string;
  const labels = selectedSeats.map((seat) => seat.label).join(", ");
  const seatIds = selectedSeats.flatMap((seat) => seat.seatIds);

  const submit = async () => {
    if (isReserving || !token || !showtimeId || seatIds.length === 0) return;

    setIsReserving(true);
    setErrorText(null);

    const result = await saveSeatHolds(showtimeId, seatIds, token);
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

  return {
    labels,
    hasSeats: selectedSeats.length > 0,
    isReserving,
    errorText,
    submit,
  };
}
