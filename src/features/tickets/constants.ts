export const TICKET_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  USED: "used",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  /** Viewer-derived (not a backend enum member): a ticket I transferred away. */
  TRANSFERRED: "transferred",
} as const;

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
