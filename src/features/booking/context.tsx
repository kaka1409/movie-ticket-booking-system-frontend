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

import type { SelectedSeat, SelectedCombo, SelectedFood } from "./types";
import { useLocale } from "@/contexts/LocaleContext";

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
  paymentMethod: string;
  ticketCount: number;
  ticketPrice: number;
  snackTotal: number;
  total: number;
  countdownStarted: boolean;
  countdownStartTime: number;
}

interface BookingContextType extends BookingState {
  countdownSeconds: number;
  setCinema: (
    cinemaId: number,
    cinemaName: string,
    time: string,
    date: string,
    room: string
  ) => void;
  setSeats: (seats: SelectedSeat[]) => void;
  setSnacks: (combos: SelectedCombo[], foods: SelectedFood[]) => void;
  setPaymentMethod: (method: string) => void;
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
  paymentMethod: "",
  ticketCount: 0,
  ticketPrice: 0,
  snackTotal: 0,
  total: 0,
  countdownStarted: false,
  countdownStartTime: 0,
};

/* ─── Context ───────────────────────────────────────────── */

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
  initialCountdownSeconds = 359,
}: {
  children: ReactNode;
  initialCountdownSeconds?: number;
}) {
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [combos, setCombos] = useState<SelectedCombo[]>([]);
  const [foods, setFoods] = useState<SelectedFood[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownStartTime, setCountdownStartTime] = useState(0);
  const { translate } = useLocale();

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
    setPaymentMethod("");
    setCountdownStarted(false);
    setCountdownStartTime(0);
  }, []);

  const value = useMemo<BookingContextType>(() => {
    const ticketCount = selectedSeats.length;
    const ticketPrice = selectedSeats.reduce((s, seat) => s + seat.price, 0);
    const seatType = selectedSeats[0]?.type ?? translate("booking.seats.standard");
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
      paymentMethod,
      ticketCount,
      ticketPrice,
      snackTotal,
      total,
      countdownSeconds: initialCountdownSeconds,
      countdownStarted,
      countdownStartTime,
      setCinema,
      setSeats,
      setSnacks,
      setPaymentMethod,
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
    paymentMethod,
    countdownStarted,
    countdownStartTime,
    setCinema,
    setSeats,
    setSnacks,
    setPaymentMethod,
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
