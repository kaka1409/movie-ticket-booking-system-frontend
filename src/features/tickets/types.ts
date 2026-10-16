import type { TicketStatus } from "./constants";

export interface SeatTicket {
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
  name: string;
  username: string;
  email: string;
  avatar: string;
}

export interface TicketTransfer {
  status: "pending";
  recipient: Recipient;
  transferredSeats: string[];
  transferSnacks: boolean;
}

export interface UpcomingTicket {
  id: string;
  status: Extract<TicketStatus, "success" | "failed" | "pending" | "confirmed">;
  movie: string;
  datetime: string;
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
  transfer?: TicketTransfer;
  /** Signed scan payload (`ticketId.qrToken.signature`) — rendered as the QR. */
  qrCode?: string;
}

export interface PastTicket {
  id: string;
  status: Extract<TicketStatus, "used" | "expired" | "cancelled" | "refunded">;
  movie: string;
  format: string;
  datetime: string;
  ticketCount: number;
  poster: string;
  cinema: string;
  location?: string;
  seatItems: SeatTicket[];
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
}
