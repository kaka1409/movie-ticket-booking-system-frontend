"use client";

import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import TicketOverviewCard from "@/app/(sub)/tickets/components/shared/TicketOverviewCard";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useTransfer } from "@/features/tickets/contexts/TransferContext";
import RecipientField from "../shared/RecipientField";

/**
 * Desktop transfer step: the ticket that will move beside the recipient picker.
 * The offer is the whole ticket, so the only choice on this page is who receives
 * it — the amount is frozen by the backend when the offer is created.
 */
export default function TransferContent() {
  const router = useRouter();
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { recipient } = useTransfer();

  const handleContinue = () => {
    if (!recipient) return;
    router.push(
      `/tickets/${ticket.id}/transfer/confirm?recipient=${encodeURIComponent(recipient.email)}`,
    );
  };

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
          {translate("tickets.transfer.title")}
        </p>
        <h1 className="mt-1.5 text-[26px] font-black tracking-tight text-white">{ticket.movie}</h1>
      </header>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
        <TicketOverviewCard labelKey="tickets.transfer.whole_ticket" className="lg:p-6" />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <RecipientField />

          <p className="flex items-start gap-2 text-xs text-(--color-text-muted)">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-(--color-gold)" />
            {translate("tickets.transfer.warning")}
          </p>

          <Button
            icon={ArrowRight}
            disabled={recipient === null}
            onClick={handleContinue}
            className="disabled:bg-(--color-surface) disabled:text-(--color-text-muted) disabled:border disabled:border-(--color-border)"
          >
            {translate("tickets.transfer.continue")}
          </Button>
        </aside>
      </div>
    </div>
  );
}
