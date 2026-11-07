"use server";

import { actionFailureFromApiError, apiFetch, toActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import { mutateAdmin } from "../mutation";
import type {
  AdminActionResult,
  AdminTicketCancelResult,
  AdminTicketDetail,
  AdminTransactionDetail,
} from "../types";

/**
 * Transaction/ticket detail reads for the expanded table rows. They are GETs
 * but must run as actions: the client component only holds the RAM bearer,
 * while these reads are cookie-guarded (`AdminReadAuthGuard`), so the cookie
 * has to be attached server-side.
 */
export async function getAdminTransactionDetailAction(
  id: string,
): Promise<AdminActionResult<AdminTransactionDetail>> {
  try {
    const result = await apiFetch<AdminTransactionDetail>(
      `/admin/transactions/${id}`,
      { cache: "no-store" },
      undefined,
      await getRequestCookie(),
    );
    if ("error" in result) return actionFailureFromApiError(result.error);
    return { success: true, data: result.data };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function getAdminTicketDetailAction(
  id: string,
): Promise<AdminActionResult<AdminTicketDetail>> {
  try {
    const result = await apiFetch<AdminTicketDetail>(
      `/admin/tickets/${id}`,
      { cache: "no-store" },
      undefined,
      await getRequestCookie(),
    );
    if ("error" in result) return actionFailureFromApiError(result.error);
    return { success: true, data: result.data };
  } catch (error) {
    return toActionFailure(error);
  }
}

/**
 * Staff cancel of a whole order. `pending` bookings close unpaid; `paid` ones
 * refund through the ticket flow (`reason: admin_cancelled` on the Refund row).
 */
export async function cancelAdminTransactionAction(
  token: string,
  bookingId: string,
  reason?: string,
): Promise<
  AdminActionResult<{
    bookingId: string;
    status: "cancelled";
    refundStatus: "processing" | "none";
    refundAmount: number;
  }>
> {
  return mutateAdmin("POST", `/admin/transactions/${bookingId}/cancel`, token, {
    ...(reason ? { reason } : {}),
  });
}

/** Staff cancel of one entitlement — refunds the current owner, not the buyer. */
export async function cancelAdminTicketAction(
  token: string,
  ticketId: string,
): Promise<AdminActionResult<AdminTicketCancelResult>> {
  return mutateAdmin("POST", `/admin/tickets/${ticketId}/cancel`, token);
}

/** Manual gate check-in by ticket id (the QR scan path stays on /check-in). */
export async function checkInAdminTicketAction(
  token: string,
  ticketId: string,
): Promise<AdminActionResult<unknown>> {
  return mutateAdmin("POST", `/admin/tickets/${ticketId}/check-in`, token);
}
