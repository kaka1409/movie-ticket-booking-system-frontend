"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "../contexts/TicketDetailContext";

/**
 * The ticket as a transfer object: identity, seats and snacks, with the amount
 * the deal froze as the total. Used by the create/confirm step and by the
 * recipient's checkout, so both sides price the same thing the same way.
 */
export default function TransferTicketCard({
  amount,
  labelKey,
}: {
  /**
   * The frozen transfer amount. Omitted on the create step, where the offer does
   * not exist yet and the booking total *is* the amount it will freeze.
   */
  amount?: number;
  labelKey: string;
}) {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();
  const total = amount ?? ticket.totalPrice ?? 0;

  return (
    <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
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
          <h2 className="text-sm font-extrabold leading-snug text-(--color-text-primary)">
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

      <TearLine className="my-4 px-0" lineClassName="mx-0" />

      <PriceBreakdown seats={ticket.seatItems} snacks={ticket.foodDrink ?? []} total={total} />
    </section>
  );
}
