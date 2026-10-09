"use client";

import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode } from "react";

/* ─── Types ─────────────────────────────────────────────── */

import type { SelectedCombo, SelectedFood, CinemaDraft, BookingMovie, Seat, SeatRow } from "./types";
import type { BookingState } from "./reducer";
import { bookingReducer, INITIAL_BOOKING_STATE } from "./reducer";
import { useLocale } from "@/contexts/LocaleContext";

interface BookingContextType extends BookingState {
  /** Derived: translated label of the first selected seat's type. */
  seatType: string;
  ticketCount: number;
  ticketPrice: number;
  snackTotal: number;
  total: number;
  countdownSeconds: number;
  setCinema: (draft: CinemaDraft) => void;
  setCinemaQuery: (query: string) => void;
  setCinemaDate: (date: string) => void;
  clearCinemaSlot: () => void;
  adoptMovie: (movie: BookingMovie) => void;
  adoptSeatGrid: (rows: SeatRow[], maxSeats: number) => void;
  setSeatGrid: (rows: SeatRow[], maxSeats: number) => void;
  selectHoldCells: (seatIds: string[]) => void;
  clearSeatSelection: () => void;
  toggleSeat: (rowLabel: string, seat: Seat) => void;
  setSnacks: (combos: SelectedCombo[], foods: SelectedFood[]) => void;
  setPayment: (methodId: string, methodName: string) => void;
  setCredentials: (name: string, email: string, phone: string, countryCode: string) => void;
  setHoldExpiresAt: (deadline: number | null) => void;
  /** Starts the booking countdown — dispatched when the user commits at the seats-step CTA. */
  startCountdown: () => void;
  resetBooking: () => void;
}

/* ─── Context ───────────────────────────────────────────── */

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
  initialCountdownSeconds = 600,
}: {
  children: ReactNode;
  initialCountdownSeconds?: number;
}) {
  const { translate } = useLocale();
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_BOOKING_STATE);

  const setCinema = useCallback((draft: CinemaDraft) => {
    dispatch({ type: "SET_CINEMA", ...draft, showtimeId: draft.showtimeId ?? "" });
  }, []);

  const setCinemaQuery = useCallback((query: string) => {
    dispatch({ type: "SET_CINEMA_QUERY", query });
  }, []);

  const setCinemaDate = useCallback((date: string) => {
    dispatch({ type: "SET_CINEMA_DATE", date });
  }, []);

  const clearCinemaSlot = useCallback(() => {
    dispatch({ type: "CLEAR_CINEMA_SLOT" });
  }, []);

  const adoptMovie = useCallback((movie: BookingMovie) => {
    dispatch({ type: "ADOPT_MOVIE", movie });
  }, []);

  const adoptSeatGrid = useCallback((rows: SeatRow[], maxSeats: number) => {
    dispatch({ type: "ADOPT_SEAT_GRID", rows, maxSeats });
  }, []);

  const setSeatGrid = useCallback((rows: SeatRow[], maxSeats: number) => {
    dispatch({ type: "SET_SEAT_GRID", rows, maxSeats });
  }, []);

  const selectHoldCells = useCallback((seatIds: string[]) => {
    dispatch({ type: "SELECT_HOLD_CELLS", seatIds });
  }, []);

  const clearSeatSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SEAT_SELECTION" });
  }, []);

  const toggleSeat = useCallback((rowLabel: string, seat: Seat) => {
    dispatch({ type: "TOGGLE_SEAT", rowLabel, seat });
  }, []);

  const setSnacks = useCallback(
    (selectedCombos: SelectedCombo[], selectedFoods: SelectedFood[]) => {
      dispatch({ type: "SET_SNACKS", combos: selectedCombos, foods: selectedFoods });
    },
    [],
  );

  const setCredentials = useCallback(
    (name: string, email: string, phone: string, countryCode: string) => {
      dispatch({ type: "SET_CONTACT", name, email, phone, countryCode });
    },
    [],
  );

  const setPayment = useCallback((methodId: string, methodName: string) => {
    dispatch({ type: "SET_PAYMENT", methodId, methodName });
  }, []);

  const setHoldExpiresAt = useCallback((deadline: number | null) => {
    dispatch({ type: "SET_HOLD", deadline });
  }, []);

  const startCountdown = useCallback(() => {
    dispatch({ type: "START_COUNTDOWN", now: Date.now() });
  }, []);

  const resetBooking = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  /* Translated label — kept in its own memo so it refreshes on locale change
     without dragging `translate` into the whole context value memo. */
  const seatType = useMemo(
    () => state.selectedSeats[0]?.type ?? translate("booking.seats.standard"),
    [state.selectedSeats, translate],
  );

  const value = useMemo<BookingContextType>(() => {
    const ticketCount = state.selectedSeats.length;
    const ticketPrice = state.selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const snackTotal =
      state.combos.reduce((total, combo) => total + combo.price * combo.qty, 0) +
      state.foods.reduce((total, food) => total + food.price * food.qty, 0);
    const total = ticketPrice + snackTotal;

    return {
      ...state,
      countdownSeconds: initialCountdownSeconds,
      seatType,
      total,
      ticketCount,
      ticketPrice,
      snackTotal,
      setCinema,
      setCinemaQuery,
      setCinemaDate,
      clearCinemaSlot,
      adoptMovie,
      adoptSeatGrid,
      setSeatGrid,
      selectHoldCells,
      clearSeatSelection,
      toggleSeat,
      setSnacks,
      setCredentials,
      setPayment,
      setHoldExpiresAt,
      startCountdown,
      resetBooking,
    };
  }, [
    state,
    seatType,
    initialCountdownSeconds,
    setCinema,
    setCinemaQuery,
    setCinemaDate,
    clearCinemaSlot,
    adoptMovie,
    adoptSeatGrid,
    setSeatGrid,
    selectHoldCells,
    clearSeatSelection,
    toggleSeat,
    setSnacks,
    setCredentials,
    setPayment,
    setHoldExpiresAt,
    startCountdown,
    resetBooking,
  ]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
