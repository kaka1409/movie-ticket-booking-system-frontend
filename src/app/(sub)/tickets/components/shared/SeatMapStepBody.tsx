"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { resolveModifyShowtimeId } from "@/features/tickets/utils";
import Button from "@/components/ui/Button";

/**
 * Render gate for the modify seat map: failure with a retry, a pending line
 * until the grid belongs to the flow's *current* target showtime, otherwise the
 * caller's grid. The pending test compares the painted showtime with the target
 * rather than trusting the fetch status alone, so a map can never flash for a
 * showtime other than the one it was fetched for.
 */
export default function SeatMapStepBody({ children }: { children: ReactNode }) {
  const { translate } = useLocale();
  const { modificationType, selectedShowtime, seatMapStatus, paintedShowtimeId, retrySeatMap } =
    useModification();
  const { ticket } = useTicketDetail();

  const showtimeId = resolveModifyShowtimeId(
    modificationType,
    selectedShowtime?.showtimeId,
    ticket.showtimeId,
  );
  const isPaintedForTarget = seatMapStatus === "ready" && paintedShowtimeId === showtimeId;

  if (seatMapStatus === "error") {
    return (
      <div className="px-4 py-8 text-center text-(--color-text-muted)">
        <p className="mb-3 text-sm text-red-400">{translate("error.title")}</p>
        <Button variant="outline" onClick={retrySeatMap}>
          {translate("error.try_again")}
        </Button>
      </div>
    );
  }

  if (!isPaintedForTarget) {
    return (
      <div className="px-4 py-8 text-center text-(--color-text-muted)">
        {translate("tickets.modify.loading_seat_map")}
      </div>
    );
  }

  return <>{children}</>;
}
