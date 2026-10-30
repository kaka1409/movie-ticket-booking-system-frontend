import { Armchair, ArrowUpRight, CalendarDays } from "lucide-react";
import type { ModifyTypeOption, PastTicket } from "./types";

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

/** The three kinds of change, in the order both device skins list them. */
export const MODIFY_TYPE_OPTIONS: ModifyTypeOption[] = [
  { type: "showtime", icon: CalendarDays, labelKey: "tickets.modify.change_showtime", descKey: "tickets.modify.change_showtime_desc" },
  { type: "seats", icon: Armchair, labelKey: "tickets.modify.change_seats", descKey: "tickets.modify.change_seats_desc" },
  { type: "both", icon: ArrowUpRight, labelKey: "tickets.modify.change_both", descKey: "tickets.modify.change_both_desc" },
];

export type PastStatus = PastTicket["status"];

/**
 * Presentation for a finished ticket. The backend persists the terminal status
 * (`used` | `expired` | `cancelled` | `refunded`), so the card reads a label per
 * status instead of guessing from the showtime. `transferred` is viewer-derived:
 * a ticket I gave away is past the moment the recipient accepts, whatever its
 * entitlement status is.
 */
export const PAST_STATUS_META: Record<PastStatus, { labelKey: string }> = {
  used: { labelKey: "tickets.used" },
  expired: { labelKey: "tickets.expired" },
  refunded: { labelKey: "tickets.refunded" },
  cancelled: { labelKey: "tickets.cancelled" },
  transferred: { labelKey: "tickets.transfer.sent_badge" },
};

/**
 * Type guard for the terminal statuses. The detail payload's status union also
 * carries the upcoming values (`success`/`pending`/...), so callers must narrow
 * before indexing `PAST_STATUS_META`.
 */
export function isPastStatus(status: string): status is PastStatus {
  return status in PAST_STATUS_META;
}

/** Artwork fallbacks the ticket adapters substitute for a missing backend asset. */
export const POSTER_FALLBACK = "/images/movie-poster-placeholder.jpg";

export const DEFAULT_AVATAR = "/images/default-avatar.jpg";
