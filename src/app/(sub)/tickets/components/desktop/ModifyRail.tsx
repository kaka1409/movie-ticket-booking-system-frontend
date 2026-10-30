"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";

/**
 * The desktop modify summary rail — one card per step, holding the ticket being
 * changed, the step's own selection block and its CTA. Purely presentational: the
 * step decides what counts as a valid change, this only paints it.
 */
export default function ModifyRail({
  summary,
  action,
  errorText,
}: {
  /** Step-specific block rendered under the ticket identity. */
  summary?: ReactNode;
  /** The step's CTA button. */
  action: ReactNode;
  /** Inline failure line under the CTA. */
  errorText?: string | null;
}) {
  const { ticket } = useTicketDetail();
  const { translate } = useLocale();

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-5">
        <MicroLabel className="text-(--color-gold)">
          {translate("booking.common.ticket_details")}
        </MicroLabel>

        <div className="mt-4 flex gap-4">
          <div
            className="relative w-16 shrink-0 overflow-hidden rounded-md bg-(--color-surface-2)"
            style={{ aspectRatio: "2/3" }}
          >
            <Image
              src={ticket.poster}
              alt={ticket.movie}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base leading-snug font-bold text-(--color-text-primary)">
              {ticket.movie}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-(--color-text-muted)">
              <CalendarDays size={11} />
              {ticket.datetime}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-(--color-text-muted)">
              <MonitorPlay size={11} />
              {ticket.cinema}
              {ticket.room ? ` · ${ticket.room}` : ""}
            </p>
          </div>
        </div>

        {summary && (
          <div className="mt-5 space-y-4 border-t border-(--color-border) pt-5">{summary}</div>
        )}

        <div className="mt-5">{action}</div>

        {errorText && (
          <p className="mt-3 text-xs leading-relaxed font-medium text-red-400">{errorText}</p>
        )}
      </div>
    </aside>
  );
}
