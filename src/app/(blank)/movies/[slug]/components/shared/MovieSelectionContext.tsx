"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ShowtimeSelection {
  cinemaId: number;
  time: string;
  date: string;
}

interface MovieSelectionContextType {
  selectedShowtime: ShowtimeSelection | null;
  setSelectedShowtime: (selection: ShowtimeSelection | null) => void;
}

const MovieSelectionContext = createContext<MovieSelectionContextType | null>(null);

export function MovieSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeSelection | null>(null);

  return (
    <MovieSelectionContext.Provider value={{ selectedShowtime, setSelectedShowtime }}>
      {children}
    </MovieSelectionContext.Provider>
  );
}

export function useMovieSelection() {
  const ctx = useContext(MovieSelectionContext);
  if (!ctx) throw new Error("useMovieSelection must be used within MovieSelectionProvider");
  return ctx;
}
