"use client";

import { CreditCard } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";
import TearLine from "@/components/ui/TearLine";
import TicketOverviewCard from "@/app/(sub)/tickets/components/shared/TicketOverviewCard";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * Desktop cancel summary: what is being given up (the ticket card) and what comes
 * back (the amount rows). The policy takes no fee, so the refund equals what was
 * paid — the rows show that maths rather than compute it.
 */
export default function CancelSummaryPanel() {
  const { translate, locale } = useLocale();
  const { ticket } = useTicketDetail();

  const totalPrice = ticket.totalPrice ?? 0;
  const totalSeatPrice = ticket.totalSeatPrice ?? 0;
  const totalSnackPrice = ticket.totalSnackPrice ?? 0;

  return (
    <div className="min-w-0 space-y-5">
      <TicketOverviewCard labelKey="booking.common.ticket" showBreakdown={false} className="lg:p-6">
        <div className="mt-4 space-y-1.5">
          <MicroLabel className="text-(--color-text-muted)">
            {translate("tickets.cancel.seats_label")}
          </MicroLabel>
          <p className="text-sm font-bold text-(--color-text-primary)">
            {ticket.seatItems.map((seat) => seat.label).join(", ")}
          </p>
        </div>
      </TicketOverviewCard>

      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-(--color-text-muted)">
              {translate("tickets.cancel.ticket_price")}
            </span>
            <span className="font-medium text-(--color-text-primary)">
              {formatVND(totalSeatPrice, locale)}
            </span>
          </div>
          {totalSnackPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-(--color-text-muted)">
                {translate("tickets.cancel.snack_price")}
              </span>
              <span className="font-medium text-(--color-text-primary)">
                {formatVND(totalSnackPrice, locale)}
              </span>
            </div>
          )}
        </div>

        <TearLine className="my-4 px-0" />

        <div className="flex justify-between text-sm font-bold">
          <span className="text-(--color-text-primary)">
            {translate("tickets.cancel.total_paid")}
          </span>
          <span className="text-(--color-text-primary)">{formatVND(totalPrice, locale)}</span>
        </div>

        <TearLine className="my-4 px-0" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-(--color-text-primary)">
            {translate("tickets.cancel.refund_amount")}
          </span>
          <span className="text-lg font-extrabold text-(--color-gold)">
            {formatVND(totalPrice, locale)}
          </span>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-(--color-border) pt-4">
          <MicroLabel className="text-(--color-text-muted)">
            {translate("tickets.cancel.refund_to")}
          </MicroLabel>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-surface-2)">
              <CreditCard size={14} className="text-(--color-text-muted)" />
            </div>
            <div>
              <p className="text-sm font-bold text-(--color-text-primary)">
                {ticket.paymentMethod ?? "N/A"}
              </p>
              <p className="text-xs text-(--color-text-muted)">
                {translate("tickets.cancel.original_payment")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
