import type {
  AdminBookingStatus,
  AdminPaymentMethodCode,
  AdminPaymentStatus,
  AdminTicketStatus,
} from "./common";

/** One row of the admin transaction table — the booking (= order) plus payment/ticket state. */
export interface AdminTransaction {
  id: string;
  status: AdminBookingStatus;
  totalPrice: number;
  createdAt: string;
  contact: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  customer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
  movie: {
    id: string;
    title: string;
    slug: string;
    posterUrl: string | null;
  };
  showtime: {
    id: string;
    date: string;
    startTime: string;
    cinemaName: string;
    roomName: string;
    roomNameVi: string | null;
  };
  seatCount: number;
  payment: {
    id: string;
    method: AdminPaymentMethodCode;
    status: AdminPaymentStatus;
    reason: string | null;
    transactionRef: string | null;
    paidAt: string | null;
  } | null;
  ticket: {
    id: string;
    status: AdminTicketStatus;
    usedAt: string | null;
  } | null;
}

export interface AdminTransactionDetail {
  id: string;
  status: AdminBookingStatus;
  totalPrice: number;
  createdAt: string;
  expiresAt: string | null;
  contact: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  customer: {
    id: string;
    fullname: string | null;
    email: string;
    avatarUrl?: string | null;
  };
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
    cinema: {
      id: string;
      name: string;
      address: string;
    };
    room: {
      id: string;
      name: string;
      nameVi: string | null;
    };
  };
  seats: { id: string; label: string; type: string; price: number }[];
  combos: { id: string; name: string; quantity: number; price: number }[];
  foods: { id: string; name: string; quantity: number; price: number }[];
  payments: {
    id: string;
    kind: string;
    method: AdminPaymentMethodCode;
    status: AdminPaymentStatus;
    reason: string | null;
    amount: number;
    transactionRef: string | null;
    providerTransactionId: string | null;
    paidAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    refunds: {
      id: string;
      amount: number;
      status: string;
      reason: string | null;
      createdAt: string;
    }[];
  }[];
  ticket: {
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
    transfers: {
      id: string;
      status: string;
      amount: number;
      paymentExpiresAt: string | null;
      createdAt: string;
      senderId: string;
      recipientId: string;
    }[];
  } | null;
}

export interface AdminTransactionQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminBookingStatus | "";
  paymentStatus?: AdminPaymentStatus | "";
  paymentMethod?: AdminPaymentMethodCode | "";
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
  dir?: "asc" | "desc";
}
