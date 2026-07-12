"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/* ─── Types ─────────────────────────────────────────────── */

export interface SelectedSeat {
  label: string;
  type: string;
  price: number;
}

export interface SelectedCombo {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface SelectedFood {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface BookingState {
  cinemaId: number | null;
  cinemaName: string;
  time: string;
  date: string;
  room: string;
  selectedSeats: SelectedSeat[];
  seatType: string;
  combos: SelectedCombo[];
  foods: SelectedFood[];
  ticketCount: number;
  ticketPrice: number;
  snackTotal: number;
  total: number;
  countdownStarted: boolean;
  countdownStartTime: number;
}

interface BookingContextType extends BookingState {
  setCinema: (
    cinemaId: number,
    cinemaName: string,
    time: string,
    date: string,
    room: string
  ) => void;
  setSeats: (seats: SelectedSeat[]) => void;
  setSnacks: (combos: SelectedCombo[], foods: SelectedFood[]) => void;
  startCountdown: () => void;
  resetBooking: () => void;
}

/* ─── Default state ─────────────────────────────────────── */

const DEFAULT_STATE: BookingState = {
  cinemaId: null,
  cinemaName: "",
  time: "",
  date: "",
  room: "",
  selectedSeats: [],
  seatType: "Standard",
  combos: [],
  foods: [],
  ticketCount: 0,
  ticketPrice: 0,
  snackTotal: 0,
  total: 0,
  countdownStarted: false,
  countdownStartTime: 0,
};

/* ─── Context ───────────────────────────────────────────── */

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [combos, setCombos] = useState<SelectedCombo[]>([]);
  const [foods, setFoods] = useState<SelectedFood[]>([]);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownStartTime, setCountdownStartTime] = useState(0);

  const setCinema = useCallback(
    (
      id: number,
      name: string,
      t: string,
      d: string,
      r: string
    ) => {
      setCinemaId(id);
      setCinemaName(name);
      setTime(t);
      setDate(d);
      setRoom(r);
    },
    []
  );

  const setSeats = useCallback((seats: SelectedSeat[]) => {
    setSelectedSeats(seats);
  }, []);

  const setSnacks = useCallback(
    (c: SelectedCombo[], f: SelectedFood[]) => {
      setCombos(c);
      setFoods(f);
    },
    []
  );

  const startCountdown = useCallback(() => {
    if (!countdownStarted) {
      setCountdownStarted(true);
      setCountdownStartTime(Date.now());
    }
  }, [countdownStarted]);

  const resetBooking = useCallback(() => {
    setCinemaId(null);
    setCinemaName("");
    setTime("");
    setDate("");
    setRoom("");
    setSelectedSeats([]);
    setCombos([]);
    setFoods([]);
    setCountdownStarted(false);
    setCountdownStartTime(0);
  }, []);

  const value = useMemo<BookingContextType>(() => {
    const ticketCount = selectedSeats.length;
    const ticketPrice = selectedSeats.reduce((s, seat) => s + seat.price, 0);
    const seatType = selectedSeats[0]?.type ?? "Standard";
    const snackTotal =
      combos.reduce((s, c) => s + c.price * c.qty, 0) +
      foods.reduce((s, f) => s + f.price * f.qty, 0);
    const total = ticketPrice + snackTotal;

    return {
      cinemaId,
      cinemaName,
      time,
      date,
      room,
      selectedSeats,
      seatType,
      combos,
      foods,
      ticketCount,
      ticketPrice,
      snackTotal,
      total,
      countdownStarted,
      countdownStartTime,
      setCinema,
      setSeats,
      setSnacks,
      startCountdown,
      resetBooking,
    };
  }, [
    cinemaId,
    cinemaName,
    time,
    date,
    room,
    selectedSeats,
    combos,
    foods,
    countdownStarted,
    countdownStartTime,
    setCinema,
    setSeats,
    setSnacks,
    startCountdown,
    resetBooking,
  ]);

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
