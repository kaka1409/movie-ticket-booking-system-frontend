"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Movie } from "@/features/movies/types";
import {
  useQuickBooking,
  type QuickBookingController,
} from "@/features/showtimes/hooks/useQuickBooking";

const QuickBookingContext = createContext<QuickBookingController | null>(null);

/**
 * Owns the single quick-booking controller for the page. It sits above BOTH
 * device trees on purpose: they render at the same time, so a controller per
 * skin would fire every dates/slots request twice.
 */
export function QuickBookingProvider({
  movies,
  children,
}: {
  movies: Movie[];
  children: ReactNode;
}) {
  const controller = useQuickBooking({ movies });
  return <QuickBookingContext.Provider value={controller}>{children}</QuickBookingContext.Provider>;
}

export function useQuickBookingContext(): QuickBookingController {
  const controller = useContext(QuickBookingContext);
  if (!controller) throw new Error("useQuickBookingContext requires a QuickBookingProvider");
  return controller;
}
