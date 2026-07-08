export const TICKET_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  USED: "used",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];

export const SEAT_TYPES = ["Standard", "VIP", "Couple"] as const;

export const MAX_SEATS_PER_BOOKING = 10;
