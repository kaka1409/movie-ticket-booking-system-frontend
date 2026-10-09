"use client";

import { useEffect, useMemo, useRef } from "react";
import { useBooking } from "@/features/booking/context";
import { restoreSelectedSeats } from "@/features/booking/utils/seat";
import { useAuth } from "@/contexts/AuthContext";
import { useSeatHolds } from "@/features/booking/hooks/useSeatHolds";
import SeatGrid from "@/components/ui/SeatGrid";
import type { SeatRow } from "@/features/booking/types";
import type { ShowtimeDetail } from "@/features/showtimes/types";

export default function SeatMapWrapper({
  initialRows,
  maxSeats,
  initialShowtime,
}: {
  initialRows: SeatRow[];
  maxSeats: number;
  initialShowtime?: ShowtimeDetail | null;
}) {
  const { token } = useAuth();
  const {
    seatGrid,
    selectedSeats,
    showtimeId: bookingShowtimeId,
    setCinema,
    adoptSeatGrid,
    selectHoldCells,
    clearSeatSelection,
    toggleSeat,
    holdExpiresAt,
    setHoldExpiresAt,
  } = useBooking();

  // Holds follow the showtime the seat map was fetched for (URL param first).
  const showtimeId = initialShowtime?.id ?? bookingShowtimeId;

  // Keep the booking summary in sync when the step is opened directly with ?showtimeId=…
  useEffect(() => {
    if (!initialShowtime || bookingShowtimeId === initialShowtime.id) return;

    setCinema({
      cinemaId: initialShowtime.cinema.id,
      cinemaName: initialShowtime.cinema.name,
      time: initialShowtime.startTime,
      date: initialShowtime.date,
      room: initialShowtime.room.name,
      location: initialShowtime.cinema.address,
      showtimeId: initialShowtime.id,
    });
  }, [initialShowtime, bookingShowtimeId, setCinema]);

  // One-time adoption of the server map (with the draft's saved seats
  // re-marked) into the booking state.
  const adoptedRef = useRef(false);
  useEffect(() => {
    if (adoptedRef.current) return;
    adoptedRef.current = true;

    adoptSeatGrid(initialRows, maxSeats);
  }, [initialRows, maxSeats, adoptSeatGrid]);

  useSeatHolds({
    rows: seatGrid ?? initialRows,
    selectHoldCells,
    clearSeatSelection,
    showtimeId,
    token,
    holdExpiresAt,
    setHoldExpiresAt,
  });

  // First paint happens before the adoption effect runs — render the exact
  // grid the reducer is about to hold so the map never flashes empty.
  const rows = useMemo(
    () => seatGrid ?? restoreSelectedSeats(initialRows, selectedSeats),
    [seatGrid, initialRows, selectedSeats],
  );

  return <SeatGrid rows={rows} onToggle={toggleSeat} />;
}
