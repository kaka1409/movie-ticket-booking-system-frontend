"use server";

import type { ModificationType } from "./types";
import { apiMutation } from "@/libs/api";
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

/** `POST /tickets/:id/transfer` result. */
export interface TransferDetail {
  id: string;
  status: string;
  recipientId: string;
  seatIds: string[];
  transferSnacks: boolean;
  createdAt: string;
}

export type TransferActionResult =
  { success: true; data: TransferDetail } | { success: false; error: string };

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
        body: JSON.stringify({
          recipientEmail: readField(formData, "recipientEmail"),
          // One hidden input per seat → `getAll` preserves render order.
          seatIds: formData
            .getAll("seatId")
            .filter((value): value is string => typeof value === "string"),
          transferSnacks: readField(formData, "transferSnacks") === "true",
        }),
      },
      undefined,
      await getRequestCookie(),
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export type CancelTransferActionResult =
  { success: true; data: { id: string; status: string } } | { success: false; error: string };

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
    return { success: false, error: (error as Error).message };
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
  | { success: false; error: string; status?: number; code?: string };

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
    const failure = error as Error & { status?: number; code?: string };
    return {
      success: false,
      error: failure.message,
      status: failure.status,
      code: failure.code,
    };
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

/** `PATCH /tickets/:id/modify` result — the backend owns the money delta. */
export interface ModifyResult {
  ticketId: string;
  showtimeId: string;
  seatIds: string[];
  oldTotal: number;
  newTotal: number;
  delta: number;
  refundStatus: "none" | "pending";
}

export type ModifyActionResult =
  { success: true; data: ModifyResult } | { success: false; error: string };

export async function modifyTicketAction(
  prevState: ModifyActionResult,
  data: {
    ticketId: string;
    modificationType: ModificationType;
    newShowtime?: { showtimeId: string };
    newSeats?: { seatIds: string[] };
    token: string;
  },
): Promise<ModifyActionResult> {
  try {
    const { ticketId, token, ...body } = data;
    const response = await apiMutation<{ data: ModifyResult }>(
      `/tickets/${ticketId}/modify`,
      { method: "PATCH", body: JSON.stringify(body) },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

/* ─── Cancel & Refund ───────────────────────────────────── */

export type CancelActionResult =
  | {
      success: true;
      data: {
        success: boolean;
        refundStatus: "processing" | "failed";
        refundAmount: number;
      };
    }
  | { success: false; error: string };

export async function cancelTicketAction(
  prevState: CancelActionResult,
  data: { ticketId: string; token: string },
): Promise<CancelActionResult> {
  try {
    const response = await apiMutation<{
      data: {
        success: boolean;
        refundStatus: "processing" | "failed";
        refundAmount: number;
      };
    }>(`/tickets/${data.ticketId}/cancel`, { method: "POST" }, data.token);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
