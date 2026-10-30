"use client";

import { useMemo } from "react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { restoreSelectedSeats } from "@/features/booking/utils/seat";
import SeatGrid from "@/components/shared/seats/SeatGrid";
import type { SeatRow } from "@/features/booking/types";

/**
 * Seat-map surface for both skins (the caller caps its width). Lifecycle lives
 * in `SeatMapAdopter` (mounted once at page level); this only paints the draft
 * grid, falling back to the server rows with the draft's seats re-marked so the
 * first paint (before adoption) never flashes empty.
 */
export default function SeatMapWrapper({ initialRows }: { initialRows: SeatRow[] }) {
  const { seatGrid, selectedSeats, toggleSeat } = useBooking();

  const rows = useMemo(
    () => seatGrid ?? restoreSelectedSeats(initialRows, selectedSeats),
    [seatGrid, initialRows, selectedSeats],
  );

  return <SeatGrid rows={rows} onToggle={toggleSeat} />;
}
