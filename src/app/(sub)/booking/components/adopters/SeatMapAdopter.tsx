"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSeatHolds } from "@/features/booking/hooks/useSeatHolds";
import type { SeatRow } from "@/features/booking/types";
import type { ShowtimeDetail } from "@/features/showtimes/types";

/**
 * Effect-only mount helper for the seats step (renders nothing): syncs the
 * booking summary from an `?showtimeId=` deep link, adopts the server seat map
 * into the draft exactly once, and runs the seat-hold lifecycle.
 *
 * Mounted at PAGE level rather than inside a device branch — both the mobile and
 * the desktop trees render, so a per-branch mount would adopt the grid and
 * subscribe to holds twice. Presentation stays in the step components, which
 * read `seatGrid` from `useBooking()`.
 */
export default function SeatMapAdopter({
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
    showtimeId: bookingShowtimeId,
    setCinema,
    adoptSeatGrid,
    selectHoldCells,
    clearSeatSelection,
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

  return null;
}
