"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useCancelFlow } from "@/features/tickets/hooks/useCancelFlow";
import type { UpcomingTicket } from "@/features/tickets/types";

// Components
import CancelSummary from "./CancelSummary";
import CancellationPolicySheet from "./CancellationPolicySheet";
import ConfirmationSheet from "./ConfirmationSheet";
import CancelResult from "./CancelResult";

export default function CancelView() {
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const {
    view,
    isPending,
    refundAmount,
    computedRefund,
    errorMessage,
    paymentMethod,
    confirm,
    retry,
  } = useCancelFlow();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleContinue = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    confirm();
  };

  return (
    <div>
      {view === "idle" && (
        <>
          <CancelSummary
            ticket={ticket as UpcomingTicket}
            onContinue={handleContinue}
            onPolicyClick={() => setIsPolicyOpen(true)}
          />
          <CancellationPolicySheet isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
          <ConfirmationSheet
            isOpen={isConfirmOpen}
            refundAmount={computedRefund}
            onConfirm={handleConfirm}
            onCancel={() => setIsConfirmOpen(false)}
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
          errorMessage={errorMessage}
          onRetry={retry}
        />
      )}
    </div>
  );
}
