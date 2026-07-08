import type { TicketStatus } from "./constants";

export interface UpcomingTicket {
  id: string;
  status: Extract<TicketStatus, "success" | "failed" | "pending" | "confirmed">;
  movie: string;
  datetime: string;
  cinema: string;
  format: string;
  seats: string;
  amount: number;
  poster: string;
}

export interface PastTicket {
  id: string;
  status: Extract<TicketStatus, "used" | "expired" | "cancelled" | "refunded">;
  movie: string;
  format: string;
  datetime: string;
  ticketCount: number;
  poster: string;
}
