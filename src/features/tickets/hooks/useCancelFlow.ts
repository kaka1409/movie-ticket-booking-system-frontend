"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { cancelTicketAction } from "@/features/tickets/action";
import { getCancelErrorMessage } from "@/features/tickets/utils";

export type CancelFlowView = "idle" | "processing" | "success" | "failed";

interface CancelFlow {
  view: CancelFlowView;
  isPending: boolean;
  /** Refund the backend reported. */
  refundAmount: number;
  /** Full amount the confirmation sheet promises — the policy takes no fee. */
  computedRefund: number;
  /** Why the cancel was refused; `null` once it went through. */
  errorMessage: string | null;
  paymentMethod: string;
  /** Runs the mutation and moves the view to `success`/`failed`. */
  confirm: () => void;
  /** Back to `idle` for a retry. */
  retry: () => void;
}

/**
 * Cancel state machine for `/tickets/[id]/cancel`. Shared by the mobile and
 * desktop skins so both drive the same four views (idle / processing / success
 * / failed) from one place. Sheet visibility stays in the skin.
 *
 * A refusal is not a failed refund: the backend rejects the cancel outright
 * (window closed, ticket not active), so the failed view shows the reason and
 * no amount.
 */
export function useCancelFlow(): CancelFlow {
  const { ticket } = useTicketDetail();
  const { token } = useAuth();
  const { translate } = useLocale();
  const [view, setView] = useState<CancelFlowView>("idle");
  const [refundAmount, setRefundAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const computedRefund = Number(ticket.totalPrice);

  const confirm = () => {
    setView("processing");
    setErrorMessage(null);
    startTransition(async () => {
      const state = await cancelTicketAction(
        { success: false, error: "" },
        { ticketId: ticket.id, token: token ?? "" },
      );
      if (state.success) {
        setRefundAmount(state.data.refundAmount);
        setView("success");
        return;
      }
      setErrorMessage(getCancelErrorMessage(translate, { message: state.error, code: state.code }));
      setView("failed");
    });
  };

  const retry = () => {
    setView("idle");
    setRefundAmount(0);
    setErrorMessage(null);
  };

  return {
    view,
    isPending,
    refundAmount,
    computedRefund,
    errorMessage,
    paymentMethod: ticket.paymentMethod ?? "",
    confirm,
    retry,
  };
}
