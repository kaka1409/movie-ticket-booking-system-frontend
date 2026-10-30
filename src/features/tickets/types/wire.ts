import type { BookingDetail } from "@/features/booking/types";

/* ─── Wire shapes (mirror the backend TicketSummary / TicketDetail) ─── */

export interface TicketSummaryWire {
  ticketId: string;
  bookingId: string;
  ticketStatus: string;
  movieTitle: string;
  movieSlug: string;
  posterUrl: string | null;
  cinemaName: string;
  roomName: string;
  showtimeDate: string;
  showtimeStart: string;
  showtimeEnd: string;
  format: string;
  seatLabels: string[];
  seatCount: number;
  totalPrice: number;
  /** Owner-side badge: the open transfer this ticket is in, `null` when free. */
  pendingTransfer: { id: string; recipientName: string } | null;
  /** Settled-transfer provenance for the viewer, `null` when never transferred. */
  transfer: { direction: "sent" | "received"; counterpartyName: string } | null;
}

export interface TicketDetailWire extends BookingDetail {
  ticketId: string;
  ticketStatus: string;
  issuedAt: string;
  usedAt: string | null;
  /** Owner-only credential — `null` while the viewer is a pending recipient. */
  qrToken: string | null;
  qrCode?: string;
  /** Which side of the ticket the backend shaped this payload for. */
  viewerRole: "owner" | "recipient";
  pendingTransfer: {
    id: string;
    status: string;
    recipientId: string;
    recipient: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    amount: number;
    paymentExpiresAt: string | null;
    createdAt: string;
  } | null;
  incomingTransfer: {
    id: string;
    status: string;
    sender: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    amount: number;
    paymentExpiresAt: string | null;
    createdAt: string;
  } | null;
}

export interface TicketPageMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

/** Wire shape of `GET /user/search` (exact-email recipient lookup). */
export interface SearchRecipientWire {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

/** Wire shape of `GET /tickets/:id/modify/eligible-showtimes` — times are `HH:mm`. */
export interface EligibleShowtimeWire {
  showtimeId: string;
  date: string;
  startTime: string;
  endTime: string;
  format: string;
  cinema: { id: string; name: string };
  room: { id: string; name: string };
  /** The server knows both rooms, so it decides whether new seats are needed. */
  requiresSeatSelection: boolean;
}
