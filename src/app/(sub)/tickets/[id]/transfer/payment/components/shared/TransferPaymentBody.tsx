"use client";

import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  ReceiptText,
  XCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import MicroLabel from "@/components/ui/MicroLabel";
import { useLocale } from "@/contexts/LocaleContext";
import PaymentIntentActions from "@/components/shared/payment/PaymentIntentActions";
import PaymentMethodCard from "@/components/shared/payment/PaymentMethodCard";
import PaymentQrCard from "@/components/shared/payment/PaymentQrCard";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import type { TransferPaymentViewProps } from "./TransferPaymentScreen";

/** One terminal stage: icon, what happened, and where the recipient can go. */
function StagePanel({
  icon: Icon,
  tone = "gold",
  title,
  description,
  children,
}: {
  icon: typeof CheckCircle2;
  tone?: "gold" | "danger";
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "danger"
      ? "border-red-500/40 bg-red-500/10 text-red-400"
      : "border-(--color-gold)/40 bg-(--color-gold)/10 text-(--color-gold)";

  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border ${toneClass}`}
      >
        <Icon size={22} />
      </span>
      <h2 className="text-lg font-extrabold text-(--color-text-primary)">{title}</h2>
      <p className="text-sm text-(--color-text-muted)">{description}</p>
      <div className="mt-2 flex w-full flex-col gap-2">{children}</div>
    </section>
  );
}

/**
 * Every stage of the checkout in one place, so a width can never word or offer
 * a state differently. Only the QR size differs per skin.
 */
export default function TransferPaymentBody({
  qrSize,
  ...view
}: TransferPaymentViewProps & { qrSize: number }) {
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { payment } = view;
  const ticketHref = `/tickets/${ticket.id}`;

  switch (payment.stage) {
    case "reading":
      return (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-10 text-sm text-(--color-text-muted)">
          <Loader2 size={16} className="animate-spin text-(--color-gold)" />
          {translate("tickets.transfer.payment.reading")}
        </div>
      );

    case "choosing":
      return (
        <div className="space-y-4">
          {view.catalogError && <ErrorAlert message={view.catalogError} />}

          <section className="space-y-3">
            <MicroLabel className="text-(--color-text-muted)">
              {translate("tickets.transfer.payment.choose_label")}
            </MicroLabel>
            {view.paymentMethods.length === 0 ? (
              <p className="text-sm text-(--color-text-muted)">
                {translate("tickets.transfer.payment.no_methods")}
              </p>
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {view.paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isDemo={view.isDemo}
                    isSelected={method.id === view.selectedMethodId}
                    onSelect={view.onSelectMethod}
                  />
                ))}
              </div>
            )}
          </section>

          {payment.errorMessage && <ErrorAlert message={payment.errorMessage} />}

          <Button
            onClick={() => void payment.start(view.selectedMethodId)}
            disabled={view.selectedMethodId === ""}
            loading={payment.isOpening}
            icon={ArrowRight}
          >
            {translate("tickets.transfer.payment.pay_cta")}
          </Button>
        </div>
      );

    case "paying":
      return (
        <div className="space-y-4">
          <PaymentQrCard
            intent={payment.intent}
            amount={view.amount}
            methodLabel={view.methodLabel}
            expiresAt={view.paymentExpiresAt}
            qrSize={qrSize}
          />

          {payment.errorMessage && <ErrorAlert message={payment.errorMessage} />}
          {payment.notice && (
            <p className="text-xs font-semibold text-(--color-gold-light)">{payment.notice}</p>
          )}

          <PaymentIntentActions
            isDemo={view.isDemo}
            canSync={payment.intent !== null}
            isSyncing={payment.isSyncing}
            isOpening={payment.isOpening}
            simulatingOutcome={payment.simulatingOutcome}
            onSync={payment.sync}
            onSimulate={payment.simulate}
          />
        </div>
      );

    case "settled":
      return (
        <StagePanel
          icon={CheckCircle2}
          title={translate("tickets.transfer.payment.settled_title")}
          description={translate("tickets.transfer.payment.settled_desc")}
        >
          <Button href={ticketHref} icon={ArrowRight}>
            {translate("tickets.transfer.payment.open_ticket")}
          </Button>
        </StagePanel>
      );

    case "refunded":
      return (
        <StagePanel
          icon={ReceiptText}
          title={translate("tickets.transfer.payment.refund_title")}
          description={translate("tickets.transfer.payment.refund_desc")}
        >
          <Button href={ticketHref} variant="outline" icon={ArrowLeft}>
            {translate("tickets.transfer.payment.back_to_ticket")}
          </Button>
        </StagePanel>
      );

    case "expired":
      return (
        <StagePanel
          icon={Clock}
          tone="danger"
          title={translate("tickets.transfer.payment.expired_title")}
          description={translate("tickets.transfer.payment.expired_desc")}
        >
          <Button href={ticketHref} variant="outline" icon={ArrowLeft}>
            {translate("tickets.transfer.payment.back_to_ticket")}
          </Button>
        </StagePanel>
      );

    case "declined":
      return (
        <div className="space-y-4">
          <StagePanel
            icon={XCircle}
            tone="danger"
            title={translate("tickets.transfer.payment.declined_title")}
            description={translate("tickets.transfer.payment.declined_desc")}
          >
            <Button onClick={payment.retry} icon={ArrowRight}>
              {translate("tickets.transfer.payment.retry")}
            </Button>
            <Button href={ticketHref} variant="outline" icon={ArrowLeft}>
              {translate("tickets.transfer.payment.back_to_ticket")}
            </Button>
          </StagePanel>
          {payment.errorMessage && <ErrorAlert message={payment.errorMessage} />}
        </div>
      );
  }
}
