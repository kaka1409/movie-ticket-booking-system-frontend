"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { createBookingAction, payBookingAction } from "@/features/booking/action";
import { normalizePhone } from "@/libs/zod";

interface SubmitBookingResult {
  /** Whether a supported gateway is selected, so the pay CTA may be enabled. */
  canPay: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  submit: () => Promise<void>;
}

/**
 * Payment-step controller: create → pay → route to the status page. A pay
 * failure still routes (the booking exists); only a transport failure stays
 * inline. Create `409 SEAT_TAKEN` → seats, `409 INVALID_STATE` → cinema.
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

  const method = paymentMethodId === "vnpay" || paymentMethodId === "momo" ? paymentMethodId : null;
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

      const paid = await payBookingAction({ bookingId: created.data.id, method }, token);
      if (!paid.success) {
        // Booking exists but the pay call failed (network / 409 BOOKING_EXPIRED).
        router.push(
          `/booking/${slug}/status/failed?bookingId=${encodeURIComponent(created.data.id)}`,
        );
        return;
      }

      const bookingId = encodeURIComponent(created.data.id);
      if (paid.data.status === "success") {
        router.push(`/booking/${slug}/status/success?bookingId=${bookingId}`);
      } else {
        const reason = paid.data.reason ?? "payment_declined";
        router.push(
          `/booking/${slug}/status/failed?bookingId=${bookingId}&reason=${encodeURIComponent(reason)}`,
        );
      }
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
