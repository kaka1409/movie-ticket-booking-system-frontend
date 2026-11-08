import type { AdminActionResult } from "../types";

type Translate = (key: string) => string;

/** A rejected console write, as `mutateAdmin` reports it. */
type AdminFailure = Extract<AdminActionResult<never>, { success: false }>;

/**
 * Backend error codes → console copy. A refusal the operator can act on (a room
 * already booked, a demote that would empty the admin team, a ticket scanned
 * twice) gets its own sentence; every other failure keeps the backend message,
 * which is already the most specific text available.
 *
 * `surfaceKeys` lets a screen own the codes only it can produce, so a generic
 * `NOT_FOUND` never says "ticket not found" on a showtime screen.
 */
const CODE_KEYS: Record<string, string> = {
  VALIDATION_ERROR: "admin.common.validation_error",
  SHOWTIME_CONFLICT: "admin.showtimes.conflict",
  SHOWTIME_IN_USE: "admin.showtimes.in_use",
  SELF_ROLE_CHANGE: "admin.users.self_change",
  TICKET_ALREADY_USED: "admin.checkin.already_used",
  TICKET_EXPIRED: "admin.checkin.expired",
  CHECKIN_NOT_OPEN: "admin.checkin.not_open",
  INVALID_QR: "admin.checkin.invalid",
  TICKET_NOT_ACTIVE: "admin.checkin.invalid",
  TICKET_NOT_ISSUED: "admin.checkin.not_found",
};

export function resolveAdminError(
  failure: AdminFailure,
  translate: Translate,
  surfaceKeys: Record<string, string> = {},
): string {
  // The last-admin guard answers 409 FORBIDDEN, the only 409 in the user surface.
  if (failure.status === 409 && failure.code === "FORBIDDEN") {
    return translate("admin.users.last_admin");
  }

  // Validation errors often carry field-specific messages in `details`. Use the
  // first detail's message if available, since it's more actionable than the generic
  // "Validation failed" top-level message.
  if (failure.code === "VALIDATION_ERROR" && failure.details && failure.details.length > 0) {
    return failure.details[0].message;
  }

  const key = failure.code ? (surfaceKeys[failure.code] ?? CODE_KEYS[failure.code]) : undefined;

  return key ? translate(key) : failure.error;
}
