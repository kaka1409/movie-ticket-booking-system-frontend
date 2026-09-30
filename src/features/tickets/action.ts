"use server";

import type {
  UpcomingTicket,
  Recipient,
  ModificationType,
  ModificationSeat,
} from "./types";
import { apiMutation } from "@/libs/api";

/* ─── Transfer ──────────────────────────────────────────── */

export type TransferActionResult =
  | { success: true; data: UpcomingTicket }
  | { success: false; error: string };

export async function createTransfer(
  prevState: TransferActionResult,
  data: {
    ticketId: string;
    recipient: Recipient;
    seats: string[];
    transferSnacks: boolean;
    token: string;
  },
): Promise<TransferActionResult> {
  try {
    const { ticketId, token, ...body } = data;
    const response = await apiMutation<{ data: UpcomingTicket }>(
      `/tickets/${ticketId}/transfer`,
      { method: "POST", body: JSON.stringify(body) },
      token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

export async function cancelTransfer(
  prevState: TransferActionResult,
  data: { ticketId: string; token: string },
): Promise<TransferActionResult> {
  try {
    const response = await apiMutation<{ data: UpcomingTicket }>(
      `/tickets/${data.ticketId}/transfer`,
      { method: "DELETE" },
      data.token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

/* ─── Modification ──────────────────────────────────────── */

export type ModifyActionResult =
  | { success: true; data: UpcomingTicket }
  | { success: false; error: string };

export async function modifyTicket(
  prevState: ModifyActionResult,
  data: {
    ticketId: string;
    modificationType: ModificationType;
    newShowtime?: { date: string; time: string; cinema: string; room: string };
    newSeats?: ModificationSeat[];
    token: string;
  },
): Promise<ModifyActionResult> {
  try {
    const { ticketId, token, ...body } = data;
    const response = await apiMutation<{ data: UpcomingTicket }>(
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

export async function cancelTicket(
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
    }>(
      `/tickets/${data.ticketId}/cancel`,
      { method: "POST" },
      data.token,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
