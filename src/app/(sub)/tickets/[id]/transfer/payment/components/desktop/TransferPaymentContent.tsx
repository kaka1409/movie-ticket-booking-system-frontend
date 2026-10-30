"use client";

import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import TicketOverviewCard from "@/app/(sub)/tickets/components/shared/TicketOverviewCard";
import TransferPaymentBody from "../shared/TransferPaymentBody";
import type { TransferPaymentViewProps } from "../shared/TransferPaymentScreen";

export default function TransferPaymentDesktop(props: TransferPaymentViewProps) {
  const { translate } = useLocale();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        {/* Lifts every nested card to `--color-surface-2` (see global.css). */}
        <div className="surface-raised grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <div className="min-w-0 space-y-5">
            <header>
              <MicroLabel className="text-(--color-gold)">
                {translate("booking.payment.title")}
              </MicroLabel>
              <h1 className="mt-2 text-2xl font-extrabold text-(--color-text-primary)">
                {translate("tickets.transfer.payment.title")}
              </h1>
              <p className="mt-1.5 text-sm text-(--color-text-muted)">
                {translate("tickets.transfer.payment.subtitle")}
              </p>
            </header>

            <TransferPaymentBody {...props} qrSize={248} />
          </div>

          <aside className="lg:sticky lg:top-24">
            <TicketOverviewCard
              amount={props.amount}
              labelKey="tickets.transfer.payment.order_label"
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
