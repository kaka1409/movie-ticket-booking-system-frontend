import type { TicketStatus } from "./constants";

export interface SeatTicket {
  /** Backend seat UUID — present on detail payloads, absent on list summaries. */
  seatId?: string;
  label: string;
  type: string;
  price: number;
}

export interface FoodDrinkItem {
  name: string;
  price: number;
  qty: number;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

/**
 * The two states an open offer can be in: waiting for the recipient's decision,
 * then waiting for their money. `accepted` is settled and never open.
 */
export type OpenTransferStatus = "pending" | "awaiting_payment";

/** Outgoing transfer as seen by the ticket owner. */
export interface TicketTransfer {
  id: string;
  status: OpenTransferStatus;
  recipient: Recipient;
  /** Frozen at creation: the recipient buys the whole ticket, seats + snacks. */
  amount: number;
  /** Null until the recipient accepted; a new payment attempt never extends it. */
  paymentExpiresAt: string | null;
  createdAt: string;
}

/** Incoming offer as seen by the recipient (sender + price, no QR credential). */
export interface IncomingTransfer {
  id: string;
  status: OpenTransferStatus;
  sender: Recipient;
  /** What this viewer pays to receive the ticket — seats + snacks, frozen. */
  amount: number;
  /** The payment deadline once accepted; null while the decision is open. */
  paymentExpiresAt: string | null;
  createdAt: string;
}

export interface UpcomingTicket {
  id: string;
  /** Current showtime UUID — the seats-only modification step reopens this map. */
  showtimeId?: string;
  status: Extract<TicketStatus, "success" | "failed" | "pending" | "confirmed">;
  movie: string;
  datetime: string;
  /** Epoch ms of the showtime start / end — same wall-clock source as `datetime`. */
  startsAtMs: number;
  endsAtMs: number;
  cinema: string;
  location?: string;
  format: string;
  seatItems: SeatTicket[];
  poster: string;
  room?: string;
  ageRating?: string;
  totalSeatPrice?: number;
  totalSnackPrice?: number;
  totalPrice?: number;
  paymentMethod?: string;
  foodDrink?: FoodDrinkItem[];
  /** Owner view — the open transfer this owner sent to someone else. */
  transfer?: TicketTransfer;
  /** Owner view — an open transfer is in flight (drives the list-card badge). */
  isTransferring?: boolean;
  /** Who the badge names when the transfer is open. */
  transferRecipientName?: string;
  /** Recipient view — the offer this viewer must accept or decline. */
  incomingTransfer?: IncomingTransfer;
  /** Which side of the ticket the payload was shaped for (defaults to owner). */
  viewerRole?: "owner" | "recipient";
  /**
   * Signed scan payload (`ticketId.qrToken.signature`) — rendered as the QR.
   * Absent while the viewer is a pending recipient: the ticket is not theirs yet.
   */
  qrCode?: string;
}

export interface PastTicket {
  id: string;
  /** Current showtime UUID (kept for parity with UpcomingTicket). */
  showtimeId?: string;
  status: Extract<TicketStatus, "used" | "expired" | "cancelled" | "refunded" | "transferred">;
  movie: string;
  format: string;
  datetime: string;
  ticketCount: number;
  poster: string;
  cinema: string;
  location?: string;
  seatItems: SeatTicket[];
  /**
   * Provenance of a settled transfer the viewer is party to — `sent` for a
   * ticket I gave away (kept in my history) or `received` for one I was given.
   * Absent when the ticket was never transferred. Named apart from
   * `UpcomingTicket.transfer` (the *open* transfer detail) on purpose.
   */
  transferProvenance?: { direction: "sent" | "received"; counterpartyName: string };
  room?: string;
  ageRating?: string;
  totalSeatPrice?: number;
  totalSnackPrice?: number;
  totalPrice?: number;
  paymentMethod?: string;
  foodDrink?: FoodDrinkItem[];
}

/* ─── Booking Modification Types ────────────────────────── */

export type ModificationType = "showtime" | "seats" | "both";

export interface ModificationSeat {
  /** Backend seat UUID(s) for the modify PATCH — one per chair (sweetbox pair = 2). */
  seatIds: string[];
  label: string;
  type: string;
  price: number;
}

export interface EligibleShowtime {
  cinemaId: string;
  cinemaName: string;
  address: string;
  distance: string;
  time: string;
  room: string;
  date: string;
  showtimeId?: string;
  /** The target room differs from the ticket's, so its seats must be picked again. */
  requiresSeatSelection: boolean;
}
