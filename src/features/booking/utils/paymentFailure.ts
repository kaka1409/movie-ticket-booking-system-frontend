import type { PaymentFailReason } from "../types";

/**
 * Payment-failure vocabulary shared by the mobile and desktop failure screens:
 * one gateway reason token maps to one i18n message key and one display error
 * code. Kept here so the two skins cannot drift.
 */
const FAIL_REASON_MESSAGE_KEYS: Record<PaymentFailReason, string> = {
  payment_declined: "booking.status.failed.reason_payment_declined",
  insufficient_funds: "booking.status.failed.reason_insufficient_funds",
  network_error: "booking.status.failed.reason_network_error",
  expired_card: "booking.status.failed.reason_expired_card",
};

const FAIL_REASON_ERROR_CODES: Record<PaymentFailReason, string> = {
  payment_declined: "ERR_PAYMENT_DECLINED",
  insufficient_funds: "ERR_INSUFFICIENT_FUNDS",
  network_error: "ERR_NETWORK",
  expired_card: "ERR_CARD_EXPIRED",
};

/** Narrows a free-form reason token (URL param or booking payload) to a known one. */
function isKnownFailReason(reason: string | null): reason is PaymentFailReason {
  return reason !== null && reason in FAIL_REASON_ERROR_CODES;
}

/** i18n key for the human-readable failure message; unmapped reasons fall back to generic. */
export function failReasonMessageKey(reason: string | null): string {
  return isKnownFailReason(reason)
    ? FAIL_REASON_MESSAGE_KEYS[reason]
    : "booking.status.failed.reason_unknown";
}

/** Display error code printed on the failed receipt; `ERR_UNKNOWN` for unmapped reasons. */
export function paymentErrorCode(reason: string | null): string {
  return isKnownFailReason(reason) ? FAIL_REASON_ERROR_CODES[reason] : "ERR_UNKNOWN";
}
