"use server";

import { apiMutation, toActionFailure, type ActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";

/**
 * Ticket transfer actions are submitted through real `<form action={formAction}>`
 * elements, so they receive `FormData` instead of an object payload — and the
 * RAM access token never enters the DOM. Auth is forwarded as the incoming
 * refresh cookie (`ReadAuthGuard` accepts Bearer **or** the refresh cookie, the
 * same source the ticket read path uses).
 */

/** `FormData.get` returns `string | File | null` — narrow it to a plain string. */
function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/* ─── Transfer ──────────────────────────────────────────── */

/** `POST /tickets/:id/transfer` result — the offer plus the amount it froze. */
export interface TransferDetail {
  id: string;
  status: string;
  recipientId: string;
  amount: number;
  createdAt: string;
}

export type TransferActionResult =
  | { success: true; data: TransferDetail }
  | ActionFailure;

/**
 * Open a whole-ticket offer. The backend freezes `amount` from the booking's
 * total, so the payload carries no seats or snack flag: the ticket moves as-is.
 */
export async function createTransferAction(
  prevState: TransferActionResult,
  formData: FormData,
): Promise<TransferActionResult> {
  try {
    const ticketId = readField(formData, "ticketId");
    const response = await apiMutation<{ data: TransferDetail }>(
      `/tickets/${ticketId}/transfer`,
      {
        method: "POST",
        body: JSON.stringify({ recipientEmail: readField(formData, "recipientEmail") }),
      },
      undefined,
      await getRequestCookie(),
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

export type CancelTransferActionResult =
  | { success: true; data: { id: string; status: string } }
  | ActionFailure;

export async function cancelTransferAction(
  prevState: CancelTransferActionResult,
  formData: FormData,
): Promise<CancelTransferActionResult> {
  try {
    const response = await apiMutation<{ data: { id: string; status: string } }>(
      `/tickets/${readField(formData, "ticketId")}/transfer`,
      { method: "DELETE" },
      undefined,
      await getRequestCookie(),
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/* ─── Transfer decision (recipient) ─────────────────────── */

/** `POST /tickets/transfers/:transferId/{accept,decline}` result. */
export interface TransferDecision {
  id: string;
  status: string;
}

/**
 * `status`/`code` are carried through so the UI can treat `409
 * TRANSFER_NOT_PENDING` as "already handled" instead of an error.
 */
export type TransferDecisionActionResult =
  | { success: true; data: TransferDecision }
  | ActionFailure;

async function submitTransferDecision(
  transferId: string,
  decision: "accept" | "decline",
  cookie: string | undefined,
): Promise<TransferDecisionActionResult> {
  try {
    const response = await apiMutation<{ data: TransferDecision }>(
      `/tickets/transfers/${transferId}/${decision}`,
      { method: "POST" },
      undefined,
      cookie,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/** Recipient accepts — ownership (and the QR) moves to them. */
export async function acceptTransferAction(
  prevState: TransferDecisionActionResult,
  formData: FormData,
): Promise<TransferDecisionActionResult> {
  return submitTransferDecision(
    readField(formData, "transferId"),
    "accept",
    await getRequestCookie(),
  );
}

/** Recipient declines — the ticket stays with the sender. */
export async function declineTransferAction(
  prevState: TransferDecisionActionResult,
  formData: FormData,
): Promise<TransferDecisionActionResult> {
  return submitTransferDecision(
    readField(formData, "transferId"),
    "decline",
    await getRequestCookie(),
  );
}

/* ─── Modification ──────────────────────────────────────── */

/** `PATCH /tickets/:id/modify` result — a modify never moves money, so `delta` is always 0. */
export interface ModifyResult {
  ticketId: string;
  showtimeId: string;
  seatIds: string[];
  oldTotal: number;
  newTotal: number;
  delta: number;
}

/**
 * `status`/`code` are carried through so the review step can explain a known
 * rejection in the visitor's language instead of the backend's English prose.
 */
export type ModifyActionResult =
  | { success: true; data: ModifyResult }
  | ActionFailure;

export async function modifyTicketAction(
  prevState: ModifyActionResult,
  data: {
    ticketId: string;
    newShowtimeId?: string;
    newSeatIds?: string[];
    token: string;
  },
): Promise<ModifyActionResult> {
  const { ticketId, token, newShowtimeId, newSeatIds } = data;
  // Absent fields mean "unchanged": the backend derives the operation from
  // whichever keys are present, so an empty payload must stay empty.
  const body = {
    ...(newShowtimeId ? { newShowtimeId } : {}),
    ...(newSeatIds && newSeatIds.length > 0 ? { newSeatIds } : {}),
  };

  try {
    const response = await apiMutation<{ data: ModifyResult }>(
      `/tickets/${ticketId}/modify`,
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}

/* ─── Cancel & Refund ───────────────────────────────────── */

/** `POST /tickets/:id/cancel` result — the refund is recorded, the money moves in the worker. */
export type CancelActionResult =
  | {
      success: true;
      data: {
        success: boolean;
        /** `none` = nothing was owed (a zero-total ticket), not a failure. */
        refundStatus: "processing" | "none";
        refundAmount: number;
      };
    }
  | ActionFailure;

export async function cancelTicketAction(
  prevState: CancelActionResult,
  data: { ticketId: string; token: string },
): Promise<CancelActionResult> {
  try {
    const response = await apiMutation<{
      data: {
        success: boolean;
        refundStatus: "processing" | "none";
        refundAmount: number;
      };
    }>(`/tickets/${data.ticketId}/cancel`, { method: "POST" }, data.token);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return toActionFailure(error);
  }
}
