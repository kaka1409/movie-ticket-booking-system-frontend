import type { AdminBookingStatus, AdminPaymentMethodCode, AdminPaymentStatus, AdminTicketStatus } from "./common";

/** One row of the admin ticket table — entitlement + owner/buyer + showtime context. */
export interface AdminTicket {
  id: string;
  status: AdminTicketStatus;
  issuedAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  owner: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  buyer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  booking: {
    id: string;
    status: AdminBookingStatus;
    totalPrice: number;
  };
  showtime: {
    id: string;
    date: string;
    startTime: string;
    movie: {
      id: string;
      title: string;
      slug: string;
      posterUrl: string | null;
    };
    cinemaName: string;
    roomName: string;
    roomNameVi: string | null;
  };
  seatCount: number;
  hasOpenTransfer: boolean;
}

export interface AdminTicketDetail {
  id: string;
  status: AdminTicketStatus;
  issuedAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  reminderSentAt: string | null;
  owner: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  /** Same wire shape as the customer-facing booking detail (`toBookingDetail`). */
  booking: {
    id: string;
    status: AdminBookingStatus;
    totalPrice: number;
    createdAt: string;
    expiresAt: string | null;
    transactionRef: string | null;
    payment: {
      method: AdminPaymentMethodCode;
      status: AdminPaymentStatus;
      reason: string | null;
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
      room: { id: string; name: string; nameVi: string | null };
    };
    seats: { id: string; label: string; type: string; price: number }[];
    combos: { id: string; name: string; quantity: number; price: number }[];
    foods: { id: string; name: string; quantity: number; price: number }[];
    contact: { name: string; email: string; phone: string } | null;
  };
  transfers: {
    id: string;
    status: string;
    amount: number;
    paymentExpiresAt: string | null;
    createdAt: string;
    sender: { id: string; fullname: string | null; email: string; avatarUrl?: string | null };
    recipient: { id: string; fullname: string | null; email: string; avatarUrl?: string | null };
    payments: {
      id: string;
      kind: string;
      method: AdminPaymentMethodCode;
      status: AdminPaymentStatus;
      amount: number;
      transactionRef: string | null;
      paidAt: string | null;
      createdAt: string;
    }[];
  }[];
}

/** Result of an admin ticket cancel — same shape as the customer cancel. */
export interface AdminTicketCancelResult {
  success: boolean;
  refundStatus: "processing" | "none";
  refundAmount: number;
}

export interface AdminTicketQuery {
  page?: number;
  limit?: number;
  ownerSearch?: string;
  status?: AdminTicketStatus | "";
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  dir?: "asc" | "desc";
}
