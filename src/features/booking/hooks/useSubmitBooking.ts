"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { createBookingAction } from "@/features/booking/action";
import { normalizePhone } from "@/libs/validation";

interface SubmitBookingResult {
  /** Whether a gateway is selected, so the pay CTA may be enabled. */
  canPay: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  submit: () => Promise<void>;
}

/**
 * Payment-step controller: create the booking, then hand the payment attempt to
 * the QR screen. Create `409 SEAT_TAKEN` → seats, `409 INVALID_STATE` → cinema;
 * any other failure stays inline.
 */
export function useSubmitBooking(): SubmitBookingResult {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { token } = useAuth();
  const {
    showtimeId,
    selectedSeats,
    combos,
    foods,
    contactName,
    contactEmail,
    contactPhone,
    contactCountryCode,
    paymentMethodId,
  } = useBooking();
  const { translate } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // The catalog decides which ids exist (the payment step only offers enabled
  // ones); the backend validates the value against the PaymentMethod enum.
  const method = paymentMethodId === "" ? null : paymentMethodId;
  const canPay = method !== null;

  const submit = async () => {
    if (!method || isLoading) return;
    setErrorMessage(null);

    const seatIds = selectedSeats.flatMap((seat) => seat.seatIds);
    if (!token || !showtimeId || seatIds.length === 0) {
      setErrorMessage(translate("booking.payment.error_missing_selection"));
      return;
    }

    setIsLoading(true);
    try {
      const created = await createBookingAction(
        {
          showtimeId,
          seatIds,
          contact: {
            name: contactName.trim(),
            email: contactEmail.trim(),
            phone: normalizePhone(contactCountryCode, contactPhone),
          },
          combos: combos.map((combo) => ({ comboId: combo.id, quantity: combo.qty })),
          foods: foods.map((food) => ({ foodItemId: food.id, quantity: food.qty })),
          paymentMethod: method,
        },
        token,
      );

      // Another user grabbed a seat between the hold and the booking — go back
      // to the map, refetch marks the taken cells occupied, survivors re-hold.
      if (!created.success && created.code === "SEAT_TAKEN") {
        router.push(`/booking/${slug}/seats?showtimeId=${encodeURIComponent(showtimeId)}`);
        return;
      }
      // Showtime is in the past — the attempt window is gone, re-pick a slot.
      if (!created.success && created.code === "INVALID_STATE") {
        router.push(`/booking/${slug}/cinema`);
        return;
      }
      if (!created.success) {
        setErrorMessage(created.error);
        return;
      }

      // The booking exists and its seats are reserved: the QR screen owns the
      // intent from here (get-or-create + polling), so a retry there can never
      // create a second booking.
      router.push(
        `/booking/${slug}/payment/qr?bookingId=${encodeURIComponent(created.data.id)}&method=${method}`,
      );
    } catch {
      // The action unions cover backend failures — this catches the server
      // action transport itself going down (Next POST unreachable).
      setErrorMessage(translate("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return { canPay, isLoading, errorMessage, submit };
}
