import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import type { ErrorResponse } from "@/libs/api";
import { getShowtimeById } from "@/features/showtimes/api";
import { getSeatMap } from "./api";
import { adaptSeatMap } from "./utils/seatMap";
import type { SeatRow } from "./types";
import type { ShowtimeDetail } from "@/features/showtimes/types";

/** What the seats step needs: the grid, its cap, and the showtime identity. */
export interface SeatStepData {
  rows: SeatRow[];
  maxSeats: number;
  showtime: ShowtimeDetail | null;
  error: ErrorResponse["error"] | null;
  /** A rejected session renders nothing — the route's gate owns the prompt. */
  isUnauthorized: boolean;
}

/**
 * Seat map + showtime behind one read. The two calls are independent, so they go
 * out together; the mobile map, the desktop column and the adoption effect all
 * share the memoized result, which keeps the step at one round trip.
 */
export const getSeatStep = cache(async (showtimeId: string): Promise<SeatStepData> => {
  const [seatMapResult, showtimeResult] = await Promise.all([
    settleApiResponse(getSeatMap(showtimeId)),
    settleApiResponse(getShowtimeById(showtimeId)),
  ]);

  if ("error" in seatMapResult) {
    return {
      rows: [],
      maxSeats: 0,
      showtime: null,
      error: seatMapResult.error,
      isUnauthorized: seatMapResult.error.status === 401,
    };
  }

  const { rows, maxSeats } = adaptSeatMap(seatMapResult.data);

  return {
    rows,
    maxSeats,
    showtime: "error" in showtimeResult ? null : showtimeResult.data,
    error: null,
    isUnauthorized: false,
  };
});
