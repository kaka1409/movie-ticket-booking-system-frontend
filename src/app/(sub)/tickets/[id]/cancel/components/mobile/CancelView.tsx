"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { cancelTicket } from "@/features/tickets/action";
import type { UpcomingTicket } from "@/features/tickets/types";

// Components
import CancelSummary from "./CancelSummary";
import CancellationPolicySheet from "./CancellationPolicySheet";
import ConfirmationSheet from "./ConfirmationSheet";
import CancelResult from "./CancelResult";

type CancelView = "idle" | "processing" | "success" | "failed";

const CANCELLATION_FEE = 20000;

export default function CancelView() {
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { token } = useAuth();
  const [view, setView] = useState<CancelView>("idle");
  const [refundAmount, setRefundAmount] = useState(0);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const computedRefund = Number(ticket.totalPrice) - CANCELLATION_FEE;

  const handleContinue = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
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

  const handleRetry = () => {
    setView("idle");
    setRefundAmount(0);
  };

  const paymentMethod = ticket.paymentMethod ?? "";

  return (
    <div>
      {view === "idle" && (
        <>
          <CancelSummary
            ticket={ticket as UpcomingTicket}
            onContinue={handleContinue}
            onPolicyClick={() => setPolicyOpen(true)}
          />
          <CancellationPolicySheet open={policyOpen} onClose={() => setPolicyOpen(false)} />
          <ConfirmationSheet
            open={confirmOpen}
            refundAmount={computedRefund}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}

      {(view === "processing" || isPending) && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <Loader2 size={40} className="text-(--color-gold) animate-spin" />
          <p className="text-sm text-(--color-text-muted) font-medium">
            {translate("tickets.cancel.processing")}
          </p>
        </div>
      )}

      {(view === "success" || view === "failed") && (
        <CancelResult
          status={view}
          refundAmount={refundAmount}
          paymentMethod={paymentMethod}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
