"use client";

import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import TransferTicketCard from "@/features/tickets/components/TransferTicketCard";
import TransferPaymentBody from "../shared/TransferPaymentBody";
import type { TransferPaymentViewProps } from "../TransferPaymentScreen";

export default function TransferPaymentMobile(props: TransferPaymentViewProps) {
  const { translate } = useLocale();

  return (
    <div className="min-h-dvh bg-(--color-bg)">
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-6 pb-10">
        <header>
          <MicroLabel className="text-(--color-gold)">
            {translate("booking.payment.title")}
          </MicroLabel>
          <h1 className="mt-1.5 text-xl font-extrabold text-(--color-text-primary)">
            {translate("tickets.transfer.payment.title")}
          </h1>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {translate("tickets.transfer.payment.subtitle")}
          </p>
        </header>

        <TransferTicketCard amount={props.amount} labelKey="tickets.transfer.payment.order_label" />

        <TransferPaymentBody {...props} qrSize={216} />
      </main>
    </div>
  );
}
