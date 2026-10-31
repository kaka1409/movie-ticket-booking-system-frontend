"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatDate, formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";
import type { PastTicket } from "@/features/tickets/types";

const ALIGN_CLASS = {
  start: { wrapper: "items-start text-left", badge: "self-start" },
  center: { wrapper: "items-center text-center", badge: "self-center" },
} as const;

/**
 * Closed history for a ticket the viewer transferred away: who holds it now,
 * what they paid, when it settled. Both skins render this in place of the
 * credential panel — the ticket is no longer this viewer's to scan or act on.
 */
export default function TransferProvenance({
  provenance,
  align = "start",
}: {
  provenance: NonNullable<PastTicket["transferProvenance"]>;
  /** `center` matches the mobile ticket card's centred transfer blocks. */
  align?: keyof typeof ALIGN_CLASS;
}) {
  const { translate, locale } = useLocale();
  const { wrapper, badge } = ALIGN_CLASS[align];

  return (
    <div className={`flex flex-col gap-3 ${wrapper}`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/40 bg-(--color-gold)/10 px-3 py-1.5 ${badge}`}
      >
        <ArrowUpRight size={13} className="text-(--color-gold)" />
        <span className="text-[11px] font-bold tracking-wide text-(--color-gold) uppercase">
          {translate("tickets.transfer.sent_badge")}
        </span>
      </span>

      <p className="text-sm text-(--color-text-muted)">
        {translate("tickets.transfer.transferred_to").replace(
          "{name}",
          provenance.counterpartyName,
        )}
      </p>

      <div className="w-full rounded-2xl border border-(--color-border) bg-(--color-surface-2) px-4 py-3">
        <MicroLabel className="text-(--color-text-muted)">
          {translate("tickets.transfer.amount_label")}
        </MicroLabel>
        <p className="mt-1 text-lg font-extrabold text-(--color-gold)">
          {formatVND(provenance.amount ?? 0, locale)}
        </p>
        {provenance.settledAt && (
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {translate("tickets.transfer.transferred_on").replace(
              "{date}",
              formatDate(provenance.settledAt, locale),
            )}
          </p>
        )}
      </div>

      <p className="text-xs text-(--color-text-muted)">
        {translate("tickets.transfer.transferred_note")}
      </p>
    </div>
  );
}
