"use client";

import { useMemo } from "react";
import { useBooking } from "@/features/booking/context";
import { restoreSelectedSeats } from "@/features/booking/utils/seat";
import SeatGrid from "@/components/ui/SeatGrid";
import type { SeatRow } from "@/features/booking/types";

/**
 * Mobile seat-map surface. The adoption/hold side effects live in
 * `SeatMapAdopter` (mounted once at page level); this component only paints the
 * draft grid. First paint happens before the adoption effect runs, so it falls
 * back to the server rows with the draft's seats re-marked — the map never
 * flashes empty.
 */
export default function SeatMapWrapper({ initialRows }: { initialRows: SeatRow[] }) {
  const { seatGrid, selectedSeats, toggleSeat } = useBooking();

  const rows = useMemo(
    () => seatGrid ?? restoreSelectedSeats(initialRows, selectedSeats),
    [seatGrid, initialRows, selectedSeats],
  );

  return <SeatGrid rows={rows} onToggle={toggleSeat} />;
}
