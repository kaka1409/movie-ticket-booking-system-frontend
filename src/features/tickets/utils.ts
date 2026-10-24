import { toLocaleTag } from "@/libs/utils";

/**
 * Backend rejection → locale key. The backend's prose is canonical English, so
 * the code is the only stable hook; an unmapped code keeps the server message
 * rather than hiding the reason.
 */
function localizeFailure(
  translate: (key: string) => string,
  keys: Record<string, string>,
  failure: { message: string; code?: string },
): string {
  const key = failure.code ? keys[failure.code] : undefined;
  return key ? translate(key) : failure.message;
}

/**
 * `MODIFICATION_NOT_ALLOWED` also covers a cross-cinema target, but the
 * eligible-showtime list only ever offers the same cinema, so from this UI it
 * always means the change window has closed.
 */
const MODIFY_ERROR_KEYS: Record<string, string> = {
  TICKET_TRANSFER_PENDING: "tickets.modify.error.transfer_pending",
  TICKET_NOT_ACTIVE: "tickets.modify.error.not_active",
  MODIFICATION_NOT_ALLOWED: "tickets.modify.error.window_closed",
  MODIFICATION_REQUIRES_PAYMENT: "tickets.modify.error.requires_payment",
  MODIFICATION_LIMIT_REACHED: "tickets.modify.error.limit_reached",
  MODIFICATION_SEAT_COUNT_MISMATCH: "tickets.modify.error.seat_count",
  SEAT_TAKEN: "tickets.modify.error.seat_taken",
  VALIDATION_ERROR: "tickets.modify.error.no_change",
};

/** Localized explanation of a rejected modification, falling back to the server text. */
export function getModifyErrorMessage(
  translate: (key: string) => string,
  failure: { message: string; code?: string },
): string {
  return localizeFailure(translate, MODIFY_ERROR_KEYS, failure);
}

/** The cancel route has one policy rule (the time gate) — everything else is a state the ticket is in. */
const CANCEL_ERROR_KEYS: Record<string, string> = {
  MODIFICATION_NOT_ALLOWED: "tickets.cancel.error.window_closed",
  TICKET_NOT_ACTIVE: "tickets.cancel.error.not_active",
  REFUND_NOT_ALLOWED: "tickets.cancel.error.no_payment",
};

/** Localized explanation of a rejected cancellation, falling back to the server text. */
export function getCancelErrorMessage(
  translate: (key: string) => string,
  failure: { message: string; code?: string },
): string {
  return localizeFailure(translate, CANCEL_ERROR_KEYS, failure);
}

/**
 * Transfer rejections. `TRANSFER_PAYMENT_IN_PROGRESS` is the one the sender can
 * act on: the recipient's checkout is live, so withdrawing has to wait for it.
 */
const TRANSFER_ERROR_KEYS: Record<string, string> = {
  TICKET_TRANSFER_PENDING: "tickets.transfer.error.already_open",
  TRANSFER_PAYMENT_IN_PROGRESS: "tickets.transfer.error.payment_in_progress",
  TRANSFER_NOT_PENDING: "tickets.transfer.error.not_pending",
  RECIPIENT_NOT_FOUND: "tickets.transfer.error.recipient_not_found",
  MODIFICATION_NOT_ALLOWED: "tickets.transfer.error.window_closed",
  TICKET_NOT_ACTIVE: "tickets.transfer.error.not_active",
  VALIDATION_ERROR: "tickets.transfer.error.self",
};

/** Localized explanation of a rejected transfer, falling back to the server text. */
export function getTransferErrorMessage(
  translate: (key: string) => string,
  failure: { message: string; code?: string },
): string {
  return localizeFailure(translate, TRANSFER_ERROR_KEYS, failure);
}

/**
 * Clock time of an instant (`20:15`) in the visitor's own zone — a payment
 * deadline is absolute, so it must not be shown on the cinema's wall clock.
 */
export function formatDeadlineTime(isoDate: string | null, locale: "en" | "vn"): string {
  const parsed = isoDate === null ? Number.NaN : Date.parse(isoDate);
  if (Number.isNaN(parsed)) return "";
  return new Intl.DateTimeFormat(toLocaleTag(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(parsed));
}
