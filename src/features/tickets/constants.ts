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

/** Flat fee deducted from any ticket cancellation/refund (policy value; backend enforces it too). */
export const CANCELLATION_FEE = 20000;
