"use server";

import { apiMutation, type ApiResponse } from "@/libs/api";
import type { BookingDetail, PayResult } from "./types";

export type BookingActionResult<T> =
  { success: true; data: T } | { success: false; error: string; status?: number; code?: string };

function failure(error: unknown): {
  success: false;
  error: string;
  status?: number;
  code?: string;
} {
  const cause = error as Error & { status?: number; code?: string };
  return {
    success: false,
    error: cause.message,
    status: cause.status,
    code: cause.code,
  };
}

function union<T>(result: ApiResponse<T>): BookingActionResult<T> {
  if ("error" in result) {
    return {
      success: false,
      error: result.error.message,
      status: result.error.status,
      code: result.error.code,
    };
  }
  return { success: true, data: result.data };
}

export interface CreateBookingInput {
  showtimeId: string;
  seatIds: string[];
  contact: { name: string; email: string; phone: string };
  combos?: { comboId: string; quantity: number }[];
  foods?: { foodItemId: string; quantity: number }[];
  paymentMethod: "vnpay" | "momo";
}

/** `POST /bookings` (contract §4.9) — server prices everything, returns the detail. */
export async function createBookingAction(
  input: CreateBookingInput,
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
    return failure(error);
  }
}

/** `POST /payments/:bookingId/pay` (contract §4.10) — simulation, 50/50. */
export async function payBookingAction(
  input: { bookingId: string; method: "vnpay" | "momo" },
  token: string,
): Promise<BookingActionResult<PayResult>> {
  try {
    const result = await apiMutation<ApiResponse<PayResult>>(
      `/payments/${encodeURIComponent(input.bookingId)}/pay`,
      { method: "POST", body: JSON.stringify({ method: input.method }) },
      token,
    );
    return union(result);
  } catch (error) {
    return failure(error);
  }
}
