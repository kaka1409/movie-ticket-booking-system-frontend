"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * Identity card for one ticket: poster, movie, showtime, room, an optional extra
 * block and (by default) the seat/snack price breakdown. Every ticket surface
 * that shows "the thing being acted on" reads from here — the ticket itself comes
 * from `useTicketDetail()`, so no caller can price it differently.
 */
export default function TicketOverviewCard({
  labelKey,
  amount,
  showBreakdown = true,
  children,
  className = "",
}: {
  /** Micro-label above the identity (e.g. "Whole ticket", "Ticket you are receiving"). */
  labelKey: string;
  /** Frozen total (a transfer offer amount); omitted ⇒ the ticket's own total. */
  amount?: number;
  showBreakdown?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();
  const total = amount ?? ticket.totalPrice ?? 0;

  return (
    <section
      className={`rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 ${className}`}
    >
      <MicroLabel className="text-(--color-gold)">{translate(labelKey)}</MicroLabel>

      <div className="mt-3 flex gap-3">
        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-2)">
          <Image
            src={ticket.poster}
            alt={ticket.movie}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="text-sm leading-snug font-extrabold text-(--color-text-primary)">
            {ticket.movie}
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
            <CalendarDays size={12} />
            {ticket.datetime}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
            <MonitorPlay size={12} />
            {ticket.cinema}
            {ticket.room ? ` · ${ticket.room}` : ""}
          </p>
        </div>
      </div>

      {children}

      {showBreakdown && (
        <>
          <TearLine className="my-4 px-0" lineClassName="mx-0" />
          <PriceBreakdown seats={ticket.seatItems} snacks={ticket.foodDrink ?? []} total={total} />
        </>
      )}
    </section>
  );
}
