import type { Seat, SeatRow, SelectedSeat } from "../types";
import {
  clearGridSelection,
  getSeatLabel,
  restoreSelectedSeats,
  selectCellsByIds,
} from "../utils/seat";
import { INITIAL_BOOKING_STATE } from "./initial";
import type { BookingAction, BookingState } from "./types";

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

/** Pure transition — no side effects, navigation stays in event handlers. */
export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_CINEMA": {
      const next = {
        ...state,
        cinemaId: action.cinemaId,
        cinemaName: action.cinemaName,
        time: action.time,
        date: action.date,
        room: action.room,
        location: action.location,
        showtimeId: action.showtimeId,
      };
      // A different slot invalidates the seat draft — the picked seats belong to
      // another map. The hold fields stay so `useSeatHolds` can release the old
      // hold against its own showtime instead of stranding it until its TTL.
      if (action.showtimeId === state.showtimeId) return next;
      return { ...next, selectedSeats: [], seatGrid: null, maxSeats: 0 };
    }

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
        selectedSeats: [],
        seatGrid: null,
        maxSeats: 0,
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
        selectedSeats: [],
        seatGrid: null,
        maxSeats: 0,
      };

    case "ADOPT_MOVIE":
      // The cinema page is the URL-resolved source of truth for its slug;
      // skipping the swap for the same slug keeps the draft reference stable
      // across back-navigation remounts.
      if (state.movie?.slug === action.movie.slug) return state;
      return { ...state, movie: action.movie };

    case "ADOPT_SEAT_GRID": {
      // Fresh server map + seats saved in the draft: re-mark them by seat id.
      // `restoreHeldSeats` lets a live hold overrule cells the identity-less
      // map painted `occupied` (its own seats); a SEAT_TAKEN bounce still
      // leaves stolen cells greyed out because no hold backs them.
      const restored = restoreSelectedSeats(action.rows, state.selectedSeats, {
        includeOccupied: action.restoreHeldSeats,
      });
      return {
        ...state,
        seatGrid: restored,
        maxSeats: action.maxSeats,
        selectedSeats: collectSelectedSeats(restored),
      };
    }

    case "SET_SEAT_GRID": {
      // External replace (409 recovery) — cells arrive already resolved.
      return {
        ...state,
        seatGrid: action.rows,
        maxSeats: action.maxSeats,
        selectedSeats: collectSelectedSeats(action.rows),
      };
    }

    case "SELECT_HOLD_CELLS": {
      if (!state.seatGrid) return state;
      // `GET/PUT /seat-holds` just confirmed these ids are the caller's own live
      // hold, so it outranks a map that could not resolve the caller's identity.
      const nextRows = selectCellsByIds(state.seatGrid, new Set(action.seatIds), {
        includeOccupied: true,
      });
      return {
        ...state,
        seatGrid: nextRows,
        selectedSeats: collectSelectedSeats(nextRows),
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
      return { ...state, holdExpiresAt: action.deadline, holdShowtimeId: action.showtimeId };

    case "START_COUNTDOWN":
      // The countdown begins only when the user commits at the seats-step CTA.
      if (state.countdownStarted) return state;
      return { ...state, countdownStarted: true, countdownStartTime: action.now };

    case "EXPIRE_SESSION":
      // The 10-minute session lapsed: drop the session clock so a re-pick +
      // CTA starts a brand-new session. Everything else (cinema, snacks,
      // contact) survives — the caller clears the seats + releases the hold.
      return { ...state, countdownStarted: false, countdownStartTime: 0 };

    case "RESET":
      return INITIAL_BOOKING_STATE;
  }
}
