/* ─── Re-export shared domain types ─────────────────────── */
export type {
  Showtime,
  Cinema,
  DateOption,
  SeatKind,
  SeatStatus,
  Seat,
  SeatRow,
  SeatPrice,
  FoodCategory,
  ComboItem,
  FoodItem,
  PaymentMethod,
} from "@/features/shared/types";

/* ─── Selected Items (used across booking steps) ────────── */

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

/* ─── Booking Selection ─────────────────────────────────── */

export interface BookingSelection {
  cinemaId: string | null;
  showtimeId?: string | null;
  time: string;
  date: string;
}

export const BOOKING_STEP_KEYS = [
  "booking.steps.select_cinema",
  "booking.steps.select_seats",
  "booking.steps.food_drinks",
  "booking.steps.contact_info",
  "booking.steps.payment",
] as const;

export const BOOKING_STEPS = [
  "SELECT CINEMA",
  "SELECT SEATS",
  "FOOD & DRINKS",
  "CONTACT INFO",
  "PAYMENT",
] as const;
