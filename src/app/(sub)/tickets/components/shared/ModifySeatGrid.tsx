"use client";

import { useCallback } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import type { Seat } from "@/features/booking/types";
import { getSeatLabel } from "@/features/booking/utils/seat";
import SeatGrid from "@/components/shared/seats/SeatGrid";

/**
 * Paints the modify seat map from the adopted draft. The fetch lifecycle belongs
 * to `ModifySeatMapAdopter` and the pending/error states to `SeatMapStepBody`, so
 * both device skins pick seats through this one adapter — the label/type mapping
 * that the modify PATCH depends on exists once.
 */
export default function ModifySeatGrid() {
  const { translate } = useLocale();
  const { toggleSeat, selectedSeats, seatRows } = useModification();
  const { ticket } = useTicketDetail();

  const handleToggle = useCallback(
    (rowLabel: string, seat: Seat) => {
      if (seat.status === "occupied") return;

      const label = getSeatLabel(rowLabel, seat);
      const type =
        seat.kind === "available"
          ? translate("booking.seats.standard")
          : seat.kind === "vip"
            ? "VIP"
            : "SweetBox";

      toggleSeat({ seatIds: seat.seatIds, label, type, price: seat.price });
    },
    [toggleSeat, translate],
  );

  const selectedLabels = selectedSeats.map((seat) => seat.label);
  const originalLabels = ticket.seatItems.map((seatItem) => seatItem.label);

  return (
    <SeatGrid
      rows={seatRows}
      onToggle={handleToggle}
      selectedLabels={selectedLabels}
      originalLabels={originalLabels}
    />
  );
}
