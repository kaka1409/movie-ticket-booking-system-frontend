"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { cancelTicket } from "@/features/tickets/action";
import { CANCELLATION_FEE } from "@/features/tickets/constants";

export type CancelFlowView = "idle" | "processing" | "success" | "failed";

interface CancelFlow {
  view: CancelFlowView;
  isPending: boolean;
  /** Refund the backend reported (falls back to the local estimate on failure). */
  refundAmount: number;
  /** Local estimate: total paid minus the fixed cancellation fee. */
  computedRefund: number;
  paymentMethod: string;
  /** Runs the mutation and moves the view to `success`/`failed`. */
  confirm: () => void;
  /** Back to `idle` for a retry. */
  retry: () => void;
}

/**
 * Cancel-and-refund state machine for `/tickets/[id]/cancel`. Shared by the
 * mobile and desktop skins so both drive the same four views (idle / processing
 * / success / failed) from one place. Sheet visibility stays in the skin.
 */
export function useCancelFlow(): CancelFlow {
  const { ticket } = useTicketDetail();
  const { token } = useAuth();
  const [view, setView] = useState<CancelFlowView>("idle");
  const [refundAmount, setRefundAmount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const computedRefund = Number(ticket.totalPrice) - CANCELLATION_FEE;

  const confirm = () => {
    setView("processing");
    startTransition(async () => {
      const state = await cancelTicket(
        { success: false, error: "" },
        { ticketId: ticket.id, token: token ?? "" },
      );
      if (state.success) {
        setRefundAmount(state.data.refundAmount);
        setView(state.data.success ? "success" : "failed");
      } else {
        setRefundAmount(computedRefund);
        setView("failed");
      }
    });
  };

  const retry = () => {
    setView("idle");
    setRefundAmount(0);
  };

  return {
    view,
    isPending,
    refundAmount,
    computedRefund,
    paymentMethod: ticket.paymentMethod ?? "",
    confirm,
    retry,
  };
}
