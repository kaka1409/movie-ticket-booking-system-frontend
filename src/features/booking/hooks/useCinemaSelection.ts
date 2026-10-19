"use client";

import { useMemo } from "react";
import { useBooking } from "@/features/booking/context";
import { resolveSlotSelection } from "@/features/booking/utils/cinema";
import type { Cinema } from "@/features/booking/types";

interface CinemaSelectionResult {
  /** Cinema/location search box value (draft slice). */
  query: string;
  setQuery: (query: string) => void;
  /** Cinemas matching the query on name or address. */
  filteredCinemas: Cinema[];
  selectedCinemaId: string | null;
  selectedTime: string;
  /** Same cinema + time toggles the slot off; otherwise the slot is written into the draft. */
  handleSelect: (
    nextCinemaId: string,
    nextTime: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => void;
}

/**
 * Cinema-step selection controller — filtering plus the slot toggle, shared by
 * the mobile cinema list and the desktop cinema rail. All state lives in the
 * booking draft, so both surfaces observe the same selection.
 */
export function useCinemaSelection(allCinemas: Cinema[]): CinemaSelectionResult {
  const { cinemaQuery, setCinemaQuery, cinemaId, time, date, setCinema, clearCinemaSlot } =
    useBooking();

  const filteredCinemas = useMemo(
    () =>
      allCinemas.filter(
        (cinema) =>
          cinema.name.toLowerCase().includes(cinemaQuery.toLowerCase()) ||
          cinema.address.toLowerCase().includes(cinemaQuery.toLowerCase()),
      ),
    [allCinemas, cinemaQuery],
  );

  /* Same cinema + time = toggle off; otherwise write the slot into the draft
     (room/showtime id resolved against this cinema's slots). */
  const handleSelect = (
    nextCinemaId: string,
    nextTime: string,
    meta?: { room?: string; date?: string; showtimeId?: string },
  ) => {
    if (cinemaId === nextCinemaId && time === nextTime) {
      clearCinemaSlot();
      return;
    }

    const cinema = allCinemas.find((entry) => entry.id === nextCinemaId);
    if (!cinema) return;

    setCinema(resolveSlotSelection(cinema, nextTime, date, meta?.showtimeId ?? ""));
  };

  return {
    query: cinemaQuery,
    setQuery: setCinemaQuery,
    filteredCinemas,
    selectedCinemaId: cinemaId,
    selectedTime: time,
    handleSelect,
  };
}
