"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ModificationType,
  ModificationSeat,
  EligibleShowtime,
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
  seatRows: SeatRow[];
  setSeatRows: (rows: SeatRow[]) => void;
  seatPrices: SeatPrice | null;
  setSeatPrices: (prices: SeatPrice) => void;
  dates: DateOption[];
  setDates: (dates: DateOption[]) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  query: string;
  setQuery: (query: string) => void;
}

const ModificationContext = createContext<ModificationContextType | null>(null);

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

  // Seat state
  const [seatRows, setSeatRows] = useState<SeatRow[]>([]);
  const [seatPrices, setSeatPrices] = useState<SeatPrice | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ModificationSeat[]>([]);
  const [originalSeatCount, setOriginalSeatCount] = useState(initialSeatCount);
  
  const toggleSeat = useCallback((seat: ModificationSeat) => {
    setSelectedSeats((previous) => {
      const exists = previous.some(
        (s) => s.label === seat.label && s.type === seat.type
      );
      if (exists) {
        return previous.filter(
          (s) => !(s.label === seat.label && s.type === seat.type)
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
      seatRows,
      setSeatRows,
      seatPrices,
      setSeatPrices,
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
      seatRows,
      seatPrices,
      dates,
      selectedDate,
      query,
    ]
  );

  return (
    <ModificationContext.Provider value={value}>
      {children}
    </ModificationContext.Provider>
  );
}

export function useModification() {
  const context = useContext(ModificationContext);
  if (!context) {
    throw new Error(
      "useModification must be used within ModificationProvider"
    );
  }
  return context;
}
