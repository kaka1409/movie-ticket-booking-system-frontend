export const SEAT_TYPES = ["Standard", "VIP", "Couple"] as const;

export const TICKET_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const MAX_SEATS_PER_BOOKING = 10;
