"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTransferAction } from "@/features/tickets/action";
import type { TransferActionResult } from "@/features/tickets/action";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

const initialState: TransferActionResult = { success: false, error: "" };

interface TransferSubmit {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  /** Backend rejection message from the last submit; `null` while idle or succeeding. */
  error: string | null;
  /** Selected labels → backend seat UUIDs; empty means nothing to transfer. */
  seatIds: string[];
}

/**
 * Transfer-confirm submit controller: resolves the picked seat labels to backend
 * seat UUIDs and binds `createTransferAction` as a real form action (hidden `seatId`
 * list plus `ticketId`/`recipientEmail`/`transferSnacks`, read server-side with
 * `formData.getAll()`), so React 19 wraps the submit in a transition and the RAM
 * access token never enters the DOM. Redirects to the ticket detail from an
 * effect on success — never during render.
 *
 * Shared by the mobile confirm bar and the desktop confirm rail; the markup
 * lives in `TransferConfirmForm`. Both skins render `error` as a full-width line
 * above their button row so a rejected transfer is never silent.
 */
export function useTransferSubmit(seatLabels: string[]): TransferSubmit {
  const router = useRouter();
  const { ticket } = useTicketDetail();

  const [state, formAction, isPending] = useActionState(createTransferAction, initialState);

  const seatIds = ticket.seatItems
    .filter((seat) => seatLabels.includes(seat.label) && seat.seatId)
    .map((seat) => seat.seatId as string);

  useEffect(() => {
    if (state.success) {
      router.push(`/tickets/${ticket.id}`);
    }
  }, [state, router, ticket.id]);

  return { formAction, isPending, error: state.success ? null : state.error || null, seatIds };
}
