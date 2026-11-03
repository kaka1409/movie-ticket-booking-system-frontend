"use client";

import { useBooking } from "@/features/booking/contexts/BookingContext";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import RailTheater from "./RailTheater";

/**
 * The tail of the desktop rail on the last steps: which theater/day the seats
 * are for, then seats → snacks → total. The movie identity above it comes from
 * `BookingRail`, so this stays purely booking-state.
 */
export default function RailSummary() {
  const { selectedSeats, combos, foods, total } = useBooking();

  return (
    <>
      <RailTheater />
      <PriceBreakdown seats={selectedSeats} snacks={[...combos, ...foods]} total={total} />
    </>
  );
}
