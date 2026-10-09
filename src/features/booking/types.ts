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

import type { Movie } from "@/types";

/**
 * Slim movie snapshot adopted at the cinema step — the only movie data the
 * downstream OrderSummary panels need, so credentials/payment stop refetching
 * `GET /movies/:slug` on every entry (see the booking movie-adopt flow).
 */
export type BookingMovie = Pick<Movie, "slug" | "title" | "src" | "genre" | "duration" | "ageRating">;

/* ─── Selected Items (used across booking steps) ────────── */

/** One cinema/showtime selection written into the booking draft as a unit. */
export interface CinemaDraft {
  cinemaId: string | null;
  cinemaName: string;
  time: string;
  date: string;
  room: string;
  location: string;
  showtimeId?: string;
}

export interface SelectedSeat {
  /** Backend seat UUID(s) — one id per chair; a sweetbox cell carries its pair. */
  seatIds: string[];
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

/* ─── Backend wire shapes (docs/booking-api-contract.md §4) ─ */

/** One cell of `GET /seats` — a single seat, or a sweetbox cell covering `seatIds`. */
export interface SeatMapCell {
  id: string;
  seatIds: string[];
  label: string;
  col: number;
  kind: "standard" | "vip" | "sweetbox";
  status: "idle" | "occupied";
  price: number;
  pairId?: string;
}

export interface SeatMapRow {
  label: string;
  segments: SeatMapCell[][];
}

export interface SeatMapResponse {
  showtimeId: string;
  rows: SeatMapRow[];
  seatPrices: { standard: number; vip: number; sweetbox: number };
  maxSeatsPerBooking: number;
  holdTtlSeconds: number;
}

/** `GET /seat-holds` — empty hold when none, never 404. */
export interface CurrentSeatHoldResponse {
  seatIds: string[];
  expiresAt: string | null;
}

/** `PUT /seat-holds` — `expiresAt` drives the countdown banner. */
export interface SeatHoldResponse {
  seatIds: string[];
  expiresAt: string;
  ttlSeconds: number;
}

/** `GET /payment-methods` — the FE adds `imageSrc` from a local map. */
export interface PaymentMethodOption {
  id: "vnpay" | "momo";
  name: string;
  description: string;
}

export type BookingStatus =
  "pending" | "paid" | "confirmed" | "used" | "expired" | "transferred" | "cancelled" | "refunded";

export type PaymentFailReason =
  "payment_declined" | "insufficient_funds" | "network_error" | "expired_card";

/** `POST /payments/:bookingId/pay` (contract §4.10) — 50/50 simulation. */
export interface PayResult {
  status: "success" | "failed";
  transactionRef: string | null;
  reason: PaymentFailReason | null;
}

/** `GET /bookings/:id` (contract §4.11) — status pages + payment result. */
export interface BookingDetail {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  expiresAt: string | null;
  transactionRef: string | null;
  payment: {
    method: "vnpay" | "momo";
    status: "pending" | "success" | "failed";
    reason: PaymentFailReason | null;
  } | null;
  showtime: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    format: string;
    movie: {
      id: string;
      title: string;
      slug: string;
      posterUrl: string | null;
      duration: number | null;
      ageRating: string | null;
    };
    cinema: { id: string; name: string; address: string };
    room: { id: string; name: string };
  };
  seats: { id: string; label: string; type: string; price: number }[];
  combos: { id: string; name: string; quantity: number; price: number }[];
  foods: { id: string; name: string; quantity: number; price: number }[];
  contact: { name: string; email: string; phone: string } | null;
}

/* ─── Booking steps ─────────────────────────────────────── */

export const BOOKING_STEP_KEYS = [
  "booking.steps.select_cinema",
  "booking.steps.select_seats",
  "booking.steps.food_drinks",
  "booking.steps.contact_info",
  "booking.steps.payment",
] as const;
