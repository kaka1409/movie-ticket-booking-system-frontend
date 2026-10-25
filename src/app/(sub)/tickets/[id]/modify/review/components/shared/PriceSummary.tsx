"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * What was paid for the ticket. A modification is a same-price swap, so this is
 * the whole money story — layout-free, so the skins can drop it in a card
 * (mobile) or straight into the summary rail (desktop).
 */
export default function PriceSummary() {
  const { translate, locale } = useLocale();
  const { ticket } = useTicketDetail();

  return (
    <section>
      <MicroLabel className="text-(--color-text-muted) mb-3">
        {translate("tickets.modify.review.price")}
      </MicroLabel>

      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-(--color-text-primary)">
          {translate("tickets.modify.review.total_paid")}
        </span>
        <span className="font-extrabold text-lg text-(--color-text-primary)">
          {formatVND(ticket.totalPrice ?? 0, locale)}
        </span>
      </div>

      <p className="mt-2 text-xs text-(--color-text-muted)">
        {translate("tickets.modify.review.no_extra_cost")}
      </p>
    </section>
  );
}
