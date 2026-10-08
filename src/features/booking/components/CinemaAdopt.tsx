"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "../context";
import { resolveCinemaAdoption } from "../utils/cinema";
import type { Cinema, DateOption } from "../types";

/**
 * Effect-only (renders nothing): adopts the server-resolved URL selection
 * into the booking draft once per page mount — URL params win over the saved
 * draft, and a URL date that differs clears the stale selection. Event
 * handlers take over from there (no mirror effect, so UI and draft cannot
 * diverge).
 */
export default function CinemaAdopt({
  cinemas,
  dates,
  initialCinemaId,
  initialTime,
  initialDate,
  initialShowtimeId,
}: {
  cinemas: Cinema[];
  dates: DateOption[];
  initialCinemaId: string | null;
  initialTime: string;
  initialDate: string;
  initialShowtimeId?: string | null;
}) {
  const { cinemaId, time, date, showtimeId, setCinema } = useBooking();

  const adoptedRef = useRef(false);
  useEffect(() => {
    if (adoptedRef.current) return;
    adoptedRef.current = true;

    setCinema(
      resolveCinemaAdoption({
        cinemas,
        dates,
        initialCinemaId,
        initialTime,
        initialDate,
        initialShowtimeId: initialShowtimeId ?? null,
        draft: { cinemaId, time, date, showtimeId },
      }),
    );
  }, [
    cinemas,
    dates,
    initialCinemaId,
    initialTime,
    initialDate,
    initialShowtimeId,
    cinemaId,
    time,
    date,
    showtimeId,
    setCinema,
  ]);

  return null;
}
