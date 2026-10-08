import type { Seat, SeatRow, SelectedSeat, SelectedCombo, SelectedFood } from "./types";
import {
  clearGridSelection,
  getSeatLabel,
  restoreSelectedSeats,
  selectCellsByIds,
} from "./utils/seat";

/**
 * The whole booking draft as one state object — one slice per step
 * (cinema, seats, snacks, contact, payment, hold timing).
 */
export interface BookingState {
  // Cinema & showtimes
  cinemaId: string | null;
  showtimeId: string;
  cinemaName: string;
  time: string;
  date: string;
  room: string;
  location: string;
  /** Search box on the cinema step — transient UI state, reset on adoption. */
  cinemaQuery: string;

  // Seats
  selectedSeats: SelectedSeat[];
  /** Live seat grid of the seats step — null until the step adopts its map. */
  seatGrid: SeatRow[] | null;
  /** Seat cap of the current map — written together with the grid. */
  maxSeats: number;
  countdownStarted: boolean;
  countdownStartTime: number;
  /** Absolute hold deadline (epoch ms) from `PUT /seat-holds`; null when no live hold. */
  holdExpiresAt: number | null;

  // Snacks
  combos: SelectedCombo[];
  foods: SelectedFood[];

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactCountryCode: string;

  // Payment: gateway id for the pay action, display name for PriceBreakdown
  paymentMethodId: string;
  paymentMethod: string;
}

/** Typed transitions for the booking draft. */
export type BookingAction =
  | {
      type: "SET_CINEMA";
      cinemaId: string | null;
      cinemaName: string;
      time: string;
      date: string;
      room: string;
      location: string;
      showtimeId: string;
    }
  | { type: "SET_CINEMA_QUERY"; query: string }
  | { type: "SET_CINEMA_DATE"; date: string }
  | { type: "CLEAR_CINEMA_SLOT" }
  | { type: "ADOPT_SEAT_GRID"; rows: SeatRow[]; maxSeats: number; now: number }
  | { type: "SET_SEAT_GRID"; rows: SeatRow[]; maxSeats: number; now: number }
  | { type: "SELECT_HOLD_CELLS"; seatIds: string[]; now: number }
  | { type: "CLEAR_SEAT_SELECTION" }
  | { type: "TOGGLE_SEAT"; rowLabel: string; seat: Seat; now: number }
  | { type: "SET_SNACKS"; combos: SelectedCombo[]; foods: SelectedFood[] }
  | { type: "SET_CONTACT"; name: string; email: string; phone: string; countryCode: string }
  | { type: "SET_PAYMENT"; methodId: string; methodName: string }
  | { type: "SET_HOLD"; deadline: number | null }
  | { type: "RESET" };

export const INITIAL_BOOKING_STATE: BookingState = {
  // Cinema & showtimes
  cinemaId: null,
  showtimeId: "",
  cinemaName: "",
  time: "",
  date: "",
  room: "",
  location: "",
  cinemaQuery: "",

  // Seats
  selectedSeats: [],
  seatGrid: null,
  maxSeats: 0,
  countdownStarted: false,
  countdownStartTime: 0,
  holdExpiresAt: null,

  // Snacks
  combos: [],
  foods: [],

  // Contact
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactCountryCode: "+84",

  // Payment
  paymentMethodId: "",
  paymentMethod: "",
};

/** Derive the draft's seat list from the grid — grid order, same labels/prices as before. */
function collectSelectedSeats(rows: SeatRow[]): SelectedSeat[] {
  return rows.flatMap((row) =>
    row.segments.flatMap((segment) =>
      segment
        .filter((seat) => seat.status === "selected")
        .map((seat) => ({
          seatIds: seat.seatIds,
          label: getSeatLabel(row.label, seat),
          type: seat.kind === "available" ? "Standard" : seat.kind === "vip" ? "VIP" : "SweetBox",
          price: seat.price,
        })),
    ),
  );
}

/** The countdown starts on the FIRST seat selection — later changes never reset it.
 *  `now` arrives in the action payload so the reducer stays a pure (state, action) function. */
function countdownStart(state: BookingState, hasSelection: boolean, now: number) {
  if (!hasSelection || state.countdownStarted) return {};
  return { countdownStarted: true, countdownStartTime: now };
}

/** Pure transition — no side effects, navigation stays in event handlers. */
export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_CINEMA":
      return {
        ...state,
        cinemaId: action.cinemaId,
        cinemaName: action.cinemaName,
        time: action.time,
        date: action.date,
        room: action.room,
        location: action.location,
        showtimeId: action.showtimeId,
      };

    case "SET_CINEMA_QUERY":
      return { ...state, cinemaQuery: action.query };

    case "SET_CINEMA_DATE":
      // Switching the day invalidates the picked slot — clearing it in the
      // same transition keeps the date strip and the selection in agreement.
      return {
        ...state,
        date: action.date,
        cinemaId: null,
        cinemaName: "",
        time: "",
        room: "",
        location: "",
        showtimeId: "",
      };

    case "CLEAR_CINEMA_SLOT":
      return {
        ...state,
        cinemaId: null,
        cinemaName: "",
        time: "",
        room: "",
        location: "",
        showtimeId: "",
      };

    case "ADOPT_SEAT_GRID": {
      // Fresh server map + seats saved in the draft: re-mark the saved labels
      // (a SEAT_TAKEN bounce leaves stolen cells occupied, never selected).
      const restored = restoreSelectedSeats(action.rows, state.selectedSeats);
      const selectedSeats = collectSelectedSeats(restored);
      return {
        ...state,
        seatGrid: restored,
        maxSeats: action.maxSeats,
        selectedSeats,
        ...countdownStart(state, selectedSeats.length > 0, action.now),
      };
    }

    case "SET_SEAT_GRID": {
      // External replace (409 recovery) — cells arrive already resolved.
      const selectedSeats = collectSelectedSeats(action.rows);
      return {
        ...state,
        seatGrid: action.rows,
        maxSeats: action.maxSeats,
        selectedSeats,
        ...countdownStart(state, selectedSeats.length > 0, action.now),
      };
    }

    case "SELECT_HOLD_CELLS": {
      if (!state.seatGrid) return state;
      const nextRows = selectCellsByIds(state.seatGrid, new Set(action.seatIds));
      const selectedSeats = collectSelectedSeats(nextRows);
      return {
        ...state,
        seatGrid: nextRows,
        selectedSeats,
        ...countdownStart(state, selectedSeats.length > 0, action.now),
      };
    }

    case "CLEAR_SEAT_SELECTION":
      // Hold expiry: the backend released our seats — the grid drops the
      // phantom selection and the draft's seat list empties with it.
      return {
        ...state,
        seatGrid: state.seatGrid ? clearGridSelection(state.seatGrid) : state.seatGrid,
        selectedSeats: [],
      };

    case "TOGGLE_SEAT": {
      const previousRows = state.seatGrid;
      if (!previousRows) return state;

      const selectedCount = previousRows
        .flatMap((row) => row.segments.flat())
        .filter((seat) => seat.status === "selected")
        .reduce((total, seat) => total + Math.max(seat.seatIds.length, 1), 0);

      const isDeselecting = previousRows
        .find((row) => row.label === action.rowLabel)
        ?.segments.flat()
        .some(
          (seat) =>
            seat.kind === action.seat.kind &&
            (action.seat.kind === "sweetbox"
              ? seat.pairId === action.seat.pairId
              : seat.col === action.seat.col) &&
            seat.status === "selected",
        );

      if (!isDeselecting && selectedCount >= state.maxSeats) return state;

      const nextRows = previousRows.map((row) => {
        if (row.label !== action.rowLabel) return row;

        const toggleSeat = (seat: Seat): Seat => {
          const matches =
            action.seat.kind === "sweetbox"
              ? seat.pairId === action.seat.pairId
              : seat.col === action.seat.col && seat.kind === action.seat.kind;

          if (!matches) return seat;
          return { ...seat, status: seat.status === "selected" ? "idle" : "selected" };
        };

        return { ...row, segments: row.segments.map((segment) => segment.map(toggleSeat)) };
      });

      const selectedSeats = collectSelectedSeats(nextRows);
      return {
        ...state,
        seatGrid: nextRows,
        selectedSeats,
        ...countdownStart(state, selectedSeats.length > 0, action.now),
      };
    }

    case "SET_SNACKS":
      return { ...state, combos: action.combos, foods: action.foods };

    case "SET_CONTACT":
      return {
        ...state,
        contactName: action.name,
        contactEmail: action.email,
        contactPhone: action.phone,
        contactCountryCode: action.countryCode,
      };

    case "SET_PAYMENT":
      return { ...state, paymentMethodId: action.methodId, paymentMethod: action.methodName };

    case "SET_HOLD":
      return { ...state, holdExpiresAt: action.deadline };

    case "RESET":
      return INITIAL_BOOKING_STATE;
  }
}
