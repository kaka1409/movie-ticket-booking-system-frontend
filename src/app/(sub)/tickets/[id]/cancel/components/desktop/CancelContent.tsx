"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useCancelFlow } from "@/features/tickets/hooks/useCancelFlow";
import CancelPolicyPanel from "./CancelPolicyPanel";
import CancelResult from "./CancelResult";
import CancelSummaryPanel from "./CancelSummaryPanel";

/**
 * Desktop cancel step. The four views come from `useCancelFlow` (shared with the
 * mobile skin); this skin only decides their layout — summary beside the inline
 * policy rail, a centred spinner while the cancel is in flight, and the outcome
 * card once it lands.
 */
export default function CancelContent() {
  const { translate, locale } = useLocale();
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (view === "processing" || isPending) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 py-32 lg:px-8">
        <Loader2 size={40} className="animate-spin text-(--color-gold)" />
        <p className="text-sm font-medium text-(--color-text-muted)">
          {translate("tickets.cancel.processing")}
        </p>
      </div>
    );
  }

  if (view === "success" || view === "failed") {
    return (
      <CancelResult
        status={view}
        refundAmount={refundAmount}
        paymentMethod={paymentMethod}
        errorMessage={errorMessage}
        onRetry={retry}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <Link
        href={`/tickets/${ticket.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-text-muted) transition-colors hover:text-(--color-gold) mb-3"
      >
        <ArrowLeft size={14} />
        <span>{translate("tickets.detail_title")}</span>
      </Link>

      <header className="min-w-0">
        <p className="text-2xs font-bold tracking-[0.18em] text-(--color-gold) uppercase">
          {translate("tickets.cancel.title")}
        </p>
        <h1 className="mt-1.5 text-[26px] font-black tracking-tight text-white">{ticket.movie}</h1>
      </header>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
        <CancelSummaryPanel />

        <aside className="lg:sticky lg:top-24">
          <CancelPolicyPanel onContinue={() => setIsConfirmOpen(true)} />
        </aside>
      </div>

      {/* Mounted only while open, so the focus hand-back rides on the unmount cleanup. */}
      {isConfirmOpen && (
        <ConfirmDialog
          isOpen
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            confirm();
          }}
          title={translate("tickets.cancel.confirm_heading")}
          description={translate("tickets.cancel.confirm_description")}
          confirmLabel={translate("tickets.cancel.confirm_cta")}
          cancelLabel={translate("tickets.cancel.keep_ticket")}
        >
          <div className="text-center">
            <p className="text-xs text-(--color-text-muted)">
              {translate("tickets.cancel.confirm_you_receive")}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-(--color-gold)">
              {formatVND(computedRefund, locale)}
            </p>
            <p className="mt-2 text-xs text-(--color-text-muted)">
              {translate("tickets.cancel.confirm_refund_text")}
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-(--color-text-muted)">
            {translate("tickets.cancel.confirm_warning")}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
