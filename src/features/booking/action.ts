"use server";

import {
  apiMutation,
  actionFailureFromApiError,
  toActionFailure,
  type ActionFailure,
  type ApiResponse,
} from "@/libs/api";
import type {
  BookingDetail,
  PaymentIntent,
  PaymentMethodId,
  PaymentOutcomeWithIntent,
  SimulatedOutcome,
} from "./types";

export type BookingActionResult<T> = { success: true; data: T } | ActionFailure;

function union<T>(result: ApiResponse<T>): BookingActionResult<T> {
  if ("error" in result) {
    return actionFailureFromApiError(result.error);
  }
  return { success: true, data: result.data };
}

export interface CreateBookingRequest {
  showtimeId: string;
  seatIds: string[];
  contact: { name: string; email: string; phone: string };
  combos?: { comboId: string; quantity: number }[];
  foods?: { foodItemId: string; quantity: number }[];
  paymentMethod: PaymentMethodId;
}

/** `POST /bookings` (contract §4.9) — server prices everything, returns the detail. */
export async function createBookingAction(
  input: CreateBookingRequest,
  token: string,
): Promise<BookingActionResult<BookingDetail>> {
  try {
    const result = await apiMutation<ApiResponse<BookingDetail>>(
      "/bookings",
      { method: "POST", body: JSON.stringify(input) },
      token,
    );
    return union(result);
  } catch (error) {
    return toActionFailure(error);
  }
}

/** Shared transport for the three payment mutations: envelope in, union out. */
async function mutatePayment<T>(
  path: string,
  body: unknown,
  token: string,
): Promise<BookingActionResult<T>> {
  try {
    const result = await apiMutation<ApiResponse<T>>(
      path,
      body === undefined ? { method: "POST" } : { method: "POST", body: JSON.stringify(body) },
      token,
    );
    return union(result);
  } catch (error) {
    return toActionFailure(error);
  }
}

/**
 * `POST /payments/:bookingId/create` (contract §4.12) — opens the provider
 * intent. Replaying it while one is live returns that same intent, so calling
 * it again is safe; `409 BOOKING_EXPIRED` means the payment window is gone.
 */
export async function createPaymentIntentAction(
  input: { bookingId: string; method: PaymentMethodId },
  token: string,
): Promise<BookingActionResult<PaymentIntent>> {
  return mutatePayment<PaymentIntent>(
    `/payments/${encodeURIComponent(input.bookingId)}/create`,
    { method: input.method },
    token,
  );
}

/** `POST /payments/:bookingId/simulate` (contract §4.14) — demo mode only. */
export async function simulatePaymentAction(
  input: { bookingId: string; outcome: SimulatedOutcome },
  token: string,
): Promise<BookingActionResult<PaymentOutcomeWithIntent>> {
  return mutatePayment<PaymentOutcomeWithIntent>(
    `/payments/${encodeURIComponent(input.bookingId)}/simulate`,
    { outcome: input.outcome },
    token,
  );
}

/** `POST /payments/:bookingId/sync` (contract §4.15) — reconcile a lost webhook. */
export async function syncPaymentAction(
  input: { bookingId: string },
  token: string,
): Promise<BookingActionResult<PaymentOutcomeWithIntent>> {
  return mutatePayment<PaymentOutcomeWithIntent>(
    `/payments/${encodeURIComponent(input.bookingId)}/sync`,
    undefined,
    token,
  );
}

/* ─── Transfer charge ─────────────────────────────────────── */

/**
 * `POST /payments/transfers/:transferId/create` (contract §4.17) — the
 * recipient's checkout for an accepted transfer. Replays a live attempt, and
 * `409 TRANSFER_NOT_PENDING | INVALID_STATE` means the window closed.
 */
export async function createTransferPaymentIntentAction(
  input: { transferId: string; method: PaymentMethodId },
  token: string,
): Promise<BookingActionResult<PaymentIntent>> {
  return mutatePayment<PaymentIntent>(
    `/payments/transfers/${encodeURIComponent(input.transferId)}/create`,
    { method: input.method },
    token,
  );
}

/** `POST /payments/transfers/:transferId/simulate` — demo mode only. */
export async function simulateTransferPaymentAction(
  input: { transferId: string; outcome: SimulatedOutcome },
  token: string,
): Promise<BookingActionResult<PaymentOutcomeWithIntent>> {
  return mutatePayment<PaymentOutcomeWithIntent>(
    `/payments/transfers/${encodeURIComponent(input.transferId)}/simulate`,
    { outcome: input.outcome },
    token,
  );
}

/** `POST /payments/transfers/:transferId/sync` — reconcile a lost webhook. */
export async function syncTransferPaymentAction(
  input: { transferId: string },
  token: string,
): Promise<BookingActionResult<PaymentOutcomeWithIntent>> {
  return mutatePayment<PaymentOutcomeWithIntent>(
    `/payments/transfers/${encodeURIComponent(input.transferId)}/sync`,
    undefined,
    token,
  );
}
