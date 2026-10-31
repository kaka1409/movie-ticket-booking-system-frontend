import type { PaymentMethodId } from "./payment";

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

/** `GET /payment-methods` (contract §4.5) — ids, labels and order all come from the server. */
export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  description: string;
  /** False = still listed, never selectable (no adapter yet / sales switch off). */
  enabled: boolean;
}

/** `GET /payment-methods` as the page consumes it — the full catalog plus the demo flag. */
export interface PaymentCatalog {
  methods: PaymentMethodOption[];
  /** True when the simulated provider serves charges, so the demo controls may be shown. */
  demo: boolean;
}

export type BookingStatus =
  "pending" | "paid" | "confirmed" | "used" | "expired" | "transferred" | "cancelled" | "refunded";

/** Mirrors the backend `PaymentFailReason` enum — each value maps to an i18n message. */
export type PaymentFailReason =
  | "payment_declined"
  | "insufficient_funds"
  | "network_error"
  | "expired_card"
  | "user_cancelled"
  | "gateway_error";

/** Lifecycle of one provider attempt (contract §4.13). */
export type PaymentIntentStatus = "pending" | "success" | "failed" | "expired";

/** Which handle the provider handed back: a scannable code or a hosted page to open. */
export type PaymentIntentKind = "qr" | "redirect";

/** `GET /payments/:bookingId/intent` (contract §4.13). */
export interface PaymentIntent {
  paymentId: string;
  /** The order the charge hangs off — its original order even for a transfer. */
  bookingId: string;
  /** Set when the charge buys a ticket transfer instead of an order. */
  transferId: string | null;
  method: PaymentMethodId;
  status: PaymentIntentStatus;
  amount: number;
  reason: PaymentFailReason | null;
  transactionRef: string | null;
  /** Derived from the provider handle — null on a row that never reached the provider. */
  kind: PaymentIntentKind | null;
  qrPayload: string | null;
  deeplink: string | null;
  payUrl: string | null;
  expiresAt: string | null;
}

/** What the backend did with a webhook / simulate call (contract §4.16). */
export type PaymentSettlement =
  | "settled"
  | "declined"
  | "late_success"
  | "duplicate_charge"
  /** A transfer charge captured: ownership moved and the sender's refund opened. */
  | "transfer_settled"
  /** Money captured for a transfer that had already closed, so it was refunded. */
  | "transfer_expired"
  | "no_change";

/** `POST /payments/:bookingId/simulate | sync` (contract §4.14–4.16). */
export interface PaymentOutcome {
  settlement: PaymentSettlement;
  paymentId: string;
  refundId: string | null;
  ticketId: string | null;
  /** Set when the charge paid for a transfer instead of an order. */
  transferId: string | null;
  bookingStatus: BookingStatus;
}

/** Both mutation answers carry the resulting intent, so the page never re-reads it. */
export type PaymentOutcomeWithIntent = PaymentOutcome & { intent: PaymentIntent };

/** Scripted answers the demo provider may return. */
export type SimulatedOutcome = "success" | "failure" | "cancelled";

/** `GET /bookings/:id` (contract §4.11) — status pages + payment result. */
export interface BookingDetail {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  expiresAt: string | null;
  transactionRef: string | null;
  payment: {
    method: PaymentMethodId;
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
