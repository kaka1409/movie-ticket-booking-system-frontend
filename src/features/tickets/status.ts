import type { PastTicket } from "./types";

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
 * carries the upcoming values (`success`/`pending`/…), so callers must narrow
 * before indexing `PAST_STATUS_META`.
 */
export function isPastStatus(status: string): status is PastStatus {
  return status in PAST_STATUS_META;
}
