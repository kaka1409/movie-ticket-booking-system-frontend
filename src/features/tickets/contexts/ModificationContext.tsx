"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  ModificationType,
  ModificationSeat,
  EligibleShowtime,
  SeatMapLoadStatus,
  ShowtimeLoadStatus,
} from "../types";
import type { SeatRow, SeatPrice, DateOption } from "@/features/booking/types";

interface ModificationContextType {
  modificationType: ModificationType | null;
  setModificationType: (type: ModificationType | null) => void;
  selectedShowtime: EligibleShowtime | null;
  setSelectedShowtime: (showtime: EligibleShowtime | null) => void;
  selectedSeats: ModificationSeat[];
  setSelectedSeats: (seats: ModificationSeat[]) => void;
  toggleSeat: (seat: ModificationSeat) => void;
  seatCount: number;
  originalSeatCount: number;
  setOriginalSeatCount: (count: number) => void;
  showtimes: EligibleShowtime[];
  setShowtimes: (showtimes: EligibleShowtime[]) => void;
  showtimesStatus: ShowtimeLoadStatus;
  setShowtimesStatus: (status: ShowtimeLoadStatus) => void;
  /** Re-runs the eligible-showtime fetch after a failure or an empty answer. */
  retryShowtimes: () => void;
  /** Read by the adopter alone: a bump is the only signal that forces a refetch. */
  showtimesRetryToken: number;
  seatRows: SeatRow[];
  setSeatRows: (rows: SeatRow[]) => void;
  seatPrices: SeatPrice | null;
  setSeatPrices: (prices: SeatPrice) => void;
  seatMapStatus: SeatMapLoadStatus;
  setSeatMapStatus: (status: SeatMapLoadStatus) => void;
  /**
   * The showtime the painted grid actually belongs to, written only after a
   * successful load. A gate compares it with the current target so a map never
   * paints for a showtime it was not fetched for.
   */
  paintedShowtimeId: string | null;
  setPaintedShowtimeId: (showtimeId: string | null) => void;
  /** Re-runs the seat-map fetch after a failure. */
  retrySeatMap: () => void;
  /** Read by the adopter alone: a bump is the only signal that forces a refetch. */
  seatMapRetryToken: number;
  dates: DateOption[];
  setDates: (dates: DateOption[]) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  query: string;
  setQuery: (query: string) => void;
}

const ModificationContext = createContext<ModificationContextType | null>(null);

/** Cross-step draft for the modify wizard (type, seats, showtime). */
export function ModificationProvider({
  children,
  initialSeatCount = 0,
}: {
  children: ReactNode;
  initialSeatCount?: number;
}) {
  const [modificationType, setModificationType] = useState<ModificationType | null>(null);

  // showtime states
  const [query, setQuery] = useState("");
  const [dates, setDates] = useState<DateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showtimes, setShowtimes] = useState<EligibleShowtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<EligibleShowtime | null>(null);
  const [showtimesStatus, setShowtimesStatus] = useState<ShowtimeLoadStatus>("loading");
  const [showtimesRetryToken, setShowtimesRetryToken] = useState(0);

  // Seat state
  const [seatRows, setSeatRows] = useState<SeatRow[]>([]);
  const [seatPrices, setSeatPrices] = useState<SeatPrice | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ModificationSeat[]>([]);
  const [originalSeatCount, setOriginalSeatCount] = useState(initialSeatCount);
  const [seatMapStatus, setSeatMapStatus] = useState<SeatMapLoadStatus>("loading");
  const [paintedShowtimeId, setPaintedShowtimeId] = useState<string | null>(null);
  const [seatMapRetryToken, setSeatMapRetryToken] = useState(0);

  // The fetch lifecycles live here rather than in each adopter: both device
  // trees render, so the adopter that runs the request and the gate that shows
  // its state are siblings, and the context is the only channel between them.
  const retryShowtimes = useCallback(() => setShowtimesRetryToken((token) => token + 1), []);
  const retrySeatMap = useCallback(() => setSeatMapRetryToken((token) => token + 1), []);

  const toggleSeat = useCallback((seat: ModificationSeat) => {
    setSelectedSeats((previous) => {
      const exists = previous.some(
        (candidate) => candidate.label === seat.label && candidate.type === seat.type,
      );
      if (exists) {
        return previous.filter(
          (candidate) => !(candidate.label === seat.label && candidate.type === seat.type),
        );
      }
      return [...previous, seat];
    });
  }, []);

  const value = useMemo(
    () => ({
      modificationType,
      setModificationType,
      selectedShowtime,
      setSelectedShowtime,
      selectedSeats,
      setSelectedSeats,
      toggleSeat,
      seatCount: selectedSeats.length,
      originalSeatCount,
      setOriginalSeatCount,
      showtimes,
      setShowtimes,
      showtimesStatus,
      setShowtimesStatus,
      retryShowtimes,
      showtimesRetryToken,
      seatRows,
      setSeatRows,
      seatPrices,
      setSeatPrices,
      seatMapStatus,
      setSeatMapStatus,
      paintedShowtimeId,
      setPaintedShowtimeId,
      retrySeatMap,
      seatMapRetryToken,
      dates,
      setDates,
      selectedDate,
      setSelectedDate,
      query,
      setQuery,
    }),
    [
      modificationType,
      selectedShowtime,
      selectedSeats,
      toggleSeat,
      originalSeatCount,
      showtimes,
      showtimesStatus,
      retryShowtimes,
      showtimesRetryToken,
      seatRows,
      seatPrices,
      seatMapStatus,
      paintedShowtimeId,
      retrySeatMap,
      seatMapRetryToken,
      dates,
      selectedDate,
      query,
    ],
  );

  return <ModificationContext.Provider value={value}>{children}</ModificationContext.Provider>;
}

/** Modify-wizard draft; throws outside `ModificationProvider`. */
export function useModification() {
  const context = useContext(ModificationContext);
  if (!context) {
    throw new Error("useModification must be used within ModificationProvider");
  }
  return context;
}
