"use client";

import Image from "next/image";
import { User } from "lucide-react";
import type { Recipient } from "@/features/tickets/types";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import TicketOverviewCard from "@/features/tickets/components/TicketOverviewCard";

/**
 * Confirm step: the ticket exactly as it will move (seats + snacks at the amount
 * the offer freezes) and who receives it. Nothing here is a choice — a transfer
 * has no seat subset and no snack toggle.
 */
export default function ConfirmCard({ recipient }: { recipient: Recipient }) {
  const { translate } = useLocale();

  return (
    <div className="space-y-4 px-4">
      <TicketOverviewCard labelKey="tickets.transfer.whole_ticket" />

      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 space-y-3">
        <MicroLabel className="flex items-center gap-1.5 text-(--color-text-muted)">
          <User size={10} />
          {translate("tickets.transfer.confirm_recipient_label")}
        </MicroLabel>
        <div className="flex items-center gap-3.5">
          <Image
            src={recipient.avatar}
            alt={recipient.name}
            width={44}
            height={44}
            className="shrink-0 w-11 h-11 rounded-full object-cover bg-(--color-surface-2)"
          />
          <span className="flex flex-col gap-0.5 min-w-0">
            <span className="font-bold text-sm text-(--color-text-primary)">{recipient.name}</span>
            <span className="text-xs text-(--color-text-muted)">{recipient.email}</span>
          </span>
        </div>
        <p className="text-xs text-(--color-text-muted)">{translate("tickets.transfer.warning")}</p>
      </section>
    </div>
  );
}
