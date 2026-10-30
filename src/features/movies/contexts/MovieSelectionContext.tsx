"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface ShowtimeSelection {
  showtimeId?: string;
  cinemaId: string;
  time: string;
  date: string;
}

interface MovieSelectionContextType {
  selectedShowtime: ShowtimeSelection | null;
  setSelectedShowtime: (selection: ShowtimeSelection | null) => void;
}

const MovieSelectionContext = createContext<MovieSelectionContextType | null>(null);

/**
 * Pre-selection bridge for the detail page's slot chips — **not** the booking
 * draft: the chosen showtime only seeds the Book CTA's `?showtimeId=`.
 */
export function MovieSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeSelection | null>(null);

  return (
    <MovieSelectionContext.Provider value={{ selectedShowtime, setSelectedShowtime }}>
      {children}
    </MovieSelectionContext.Provider>
  );
}

/** Showtime pre-selected on the detail page, read by the Book CTA. */
export function useMovieSelection(): MovieSelectionContextType {
  const ctx = useContext(MovieSelectionContext);
  if (!ctx) throw new Error("useMovieSelection must be used within MovieSelectionProvider");
  return ctx;
}
