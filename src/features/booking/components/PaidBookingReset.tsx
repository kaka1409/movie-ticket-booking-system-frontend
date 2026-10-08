"use client";

import { useEffect } from "react";
import type { BookingDetail } from "../types";
import { useBooking } from "../context";

/**
 * Effect-only (renders nothing): a paid booking ends the flow — drop the
 * local draft so the next booking starts fresh. The failed page renders it
 * too: opening a failed URL whose booking actually paid clears the draft the
 * same way the success page does; a still-failed booking is left untouched so
 * the retry path keeps its selection.
 */
export default function PaidBookingReset({ booking }: { booking: BookingDetail | null }) {
  const { resetBooking } = useBooking();

  useEffect(() => {
    if (booking?.status === "paid") resetBooking();
  }, [booking?.status, resetBooking]);

  return null;
}
