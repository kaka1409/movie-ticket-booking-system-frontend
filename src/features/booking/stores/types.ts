import type {
  BookingMovie,
  Seat,
  SeatRow,
  SelectedSeat,
  SelectedCombo,
  SelectedFood,
} from "../types";

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
  /** Slim movie snapshot adopted at the cinema step — feeds the OrderSummary panels downstream. */
  movie: BookingMovie | null;

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
  /**
   * Showtime the live hold belongs to. Kept apart from `showtimeId` so a slot
   * change can still release the old hold instead of stranding it until its TTL.
   */
  holdShowtimeId: string | null;

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
  | { type: "ADOPT_MOVIE"; movie: BookingMovie }
  | { type: "ADOPT_SEAT_GRID"; rows: SeatRow[]; maxSeats: number; restoreHeldSeats: boolean }
  | { type: "SET_SEAT_GRID"; rows: SeatRow[]; maxSeats: number }
  | { type: "SELECT_HOLD_CELLS"; seatIds: string[] }
  | { type: "CLEAR_SEAT_SELECTION" }
  | { type: "TOGGLE_SEAT"; rowLabel: string; seat: Seat }
  | { type: "SET_SNACKS"; combos: SelectedCombo[]; foods: SelectedFood[] }
  | { type: "SET_CONTACT"; name: string; email: string; phone: string; countryCode: string }
  | { type: "SET_PAYMENT"; methodId: string; methodName: string }
  | { type: "SET_HOLD"; deadline: number | null; showtimeId: string | null }
  | { type: "START_COUNTDOWN"; now: number }
  | { type: "EXPIRE_SESSION" }
  | { type: "RESET" };
