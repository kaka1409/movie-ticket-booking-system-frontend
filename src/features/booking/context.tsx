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
  location: string;
  selectedSeats: SelectedSeat[];
  seatType: string;
  combos: SelectedCombo[];
  foods: SelectedFood[];
  paymentMethod: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactCountryCode: string;
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
    room: string,
    location: string
  ) => void;
  setSeats: (seats: SelectedSeat[]) => void;
  setSnacks: (combos: SelectedCombo[], foods: SelectedFood[]) => void;
  setPaymentMethod: (method: string) => void;
  setCredentials: (
    name: string,
    email: string,
    phone: string,
    countryCode: string
  ) => void;
  startCountdown: () => void;
  resetBooking: () => void;
}

/* ─── Default state ─────────────────────────────────────── */

// const DEFAULT_STATE: BookingState = {
//     cinemaId: null,
//     cinemaName: "",
//     time: "",
//     date: "",
//     room: "",
//     location: "",
//     selectedSeats: [],
//   seatType: "Standard",
//   combos: [],
//   foods: [],
//   paymentMethod: "",
//   contactName: "",
//   contactEmail: "",
//   contactPhone: "",
//   contactCountryCode: "+84",
//   ticketCount: 0,
//   ticketPrice: 0,
//   snackTotal: 0,
//   total: 0,
//   countdownStarted: false,
//   countdownStartTime: 0,
// };

/* ─── Context ───────────────────────────────────────────── */

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
  initialCountdownSeconds = 359,
}: {
  children: ReactNode;
  initialCountdownSeconds?: number;
  }) {
  
  const { translate } = useLocale();

  // Cinema & showtimes
  const [cinemaId, setCinemaId] = useState<number | null>(null);
  const [cinemaName, setCinemaName] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [room, setRoom] = useState("");
  const [location, setLocation] = useState("");

  // Seats
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdownStartTime, setCountdownStartTime] = useState(0);

  // Snacks
  const [combos, setCombos] = useState<SelectedCombo[]>([]);
  const [foods, setFoods] = useState<SelectedFood[]>([]);

  // Credentials
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCountryCode, setContactCountryCode] = useState("+84");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("");

  const setCinema = useCallback(
    (
      id: number,
      name: string,
      showTime: string,
      showDate: string,
      screenRoom: string,
      location: string
    ) => {
      setCinemaId(id);
      setCinemaName(name);
      setTime(showTime);
      setDate(showDate);
      setRoom(screenRoom);
      setLocation(location);
    },
    []
  );

  const setSeats = useCallback((seats: SelectedSeat[]) => {
    setSelectedSeats(seats);
  }, []);

  const setSnacks = useCallback((
    selectedCombos: SelectedCombo[],
    selectedFoods: SelectedFood[]
  ) => {
    setCombos(selectedCombos);
    setFoods(selectedFoods);
  }, []);

  const setCredentials = useCallback((
    name: string,
    email: string,
    phone: string,
    countryCode: string
  ) => {
    setContactName(name);
    setContactEmail(email);
    setContactPhone(phone);
    setContactCountryCode(countryCode);
  }, []);

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
    setLocation("");
    setSelectedSeats([]);
    setCombos([]);
    setFoods([]);
    setPaymentMethod("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setContactCountryCode("+84");
    setCountdownStarted(false);
    setCountdownStartTime(0);
  }, []);

  const value = useMemo<BookingContextType>(() => {
    const ticketCount = selectedSeats.length;
    const ticketPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const seatType = selectedSeats[0]?.type ?? translate("booking.seats.standard");
    const snackTotal =
      combos.reduce((total, combo) => total + combo.price * combo.qty, 0) +
      foods.reduce((total, food) => total + food.price * food.qty, 0);
    const total = ticketPrice + snackTotal;

    return {
      // Cinema 
      cinemaId,
      cinemaName,
      time,
      date,
      room,
      location,
      setCinema,

      // Seats
      selectedSeats,
      seatType,
      countdownSeconds: initialCountdownSeconds,
      countdownStarted,
      countdownStartTime,
      setSeats,
      startCountdown,

      // Snacks
      combos,
      foods,
      snackTotal,
      setSnacks,

      // Credentials
      contactName,
      contactEmail,
      contactPhone,
      contactCountryCode,
      setCredentials,
      
      // Payment
      paymentMethod,
      setPaymentMethod,

      total,
      ticketCount,
      ticketPrice,
      resetBooking,
    };
  }, [
    // Cinema 
    cinemaId,
    cinemaName,
    time,
    date,
    room,
    location,
    setCinema,

    // Seats
    selectedSeats,
    countdownStarted,
    countdownStartTime,
    setSeats,
    startCountdown,

    // Snacks
    combos,
    foods,
    setSnacks,

    // Credentials
    contactName,
    contactEmail,
    contactPhone,
    contactCountryCode,
    setCredentials,
    
    // Payment
    paymentMethod,
    setPaymentMethod,

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
