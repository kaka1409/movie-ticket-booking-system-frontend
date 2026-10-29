"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import TicketOverviewCard from "@/features/tickets/components/TicketOverviewCard";
import TransferConfirmForm from "@/features/tickets/components/TransferConfirmForm";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { useTransferSubmit } from "@/features/tickets/hooks/useTransferSubmit";
import type { Recipient } from "@/features/tickets/types";

/**
 * Desktop transfer confirm: the ticket exactly as it will move beside who
 * receives it. Nothing here is a choice — a transfer has no seat subset and no
 * snack toggle, so the rail only confirms or backs out.
 *
 * The recipient arrives as a prop from the server page, which already validated
 * `?recipient=`; the draft's own copy is not needed at this step.
 */
export default function ConfirmContent({ recipient }: { recipient: Recipient }) {
  const router = useRouter();
  const { translate } = useLocale();
  const { ticket } = useTicketDetail();
  const { formAction, isPending, error } = useTransferSubmit();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <header className="min-w-0">
        <p className="text-2xs font-bold tracking-[0.18em] text-(--color-gold) uppercase">
          {translate("tickets.transfer.confirm_title")}
        </p>
        <h1 className="mt-1.5 text-[26px] font-black tracking-tight text-white">{ticket.movie}</h1>
      </header>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
        <TicketOverviewCard labelKey="tickets.transfer.whole_ticket" className="lg:p-6" />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
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
                className="h-11 w-11 shrink-0 rounded-full bg-(--color-surface-2) object-cover"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-bold text-(--color-text-primary)">
                  {recipient.name}
                </span>
                <span className="text-xs text-(--color-text-muted)">{recipient.email}</span>
              </span>
            </div>

            <p className="text-xs text-(--color-text-muted)">
              {translate("tickets.transfer.warning")}
            </p>
          </section>

          {error && (
            <p role="alert" className="text-center text-xs text-red-400">
              {error}
            </p>
          )}

          <TransferConfirmForm
            formAction={formAction}
            isPending={isPending}
            ticketId={ticket.id}
            recipientEmail={recipient.email}
          />

          <Button variant="loadMore" disabled={isPending} onClick={() => router.back()}>
            {translate("tickets.transfer.cancel")}
          </Button>
        </aside>
      </div>
    </div>
  );
}
