"use client";

import { useEffect, useCallback } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import { useTicketDetail } from "@/features/tickets/contexts/TicketDetailContext";
import { getSeatRows, getSeatPrices } from "@/features/booking/api";
import type { Seat, SeatPrice } from "@/features/booking/types";
import SeatGrid from "@/components/ui/SeatGrid";

function getSeatLabel(rowLabel: string, seat: Seat): string {
  if (seat.kind === "sweetbox" && seat.pairId) {
    return `${rowLabel}(${seat.pairId.split("-").slice(1).join("-")})`;
  }
  return `${rowLabel}${seat.col}`;
}

export default function SeatMapWrapper() {
  const { translate } = useLocale();
  const { toggleSeat, selectedSeats, seatRows, setSeatRows, seatPrices, setSeatPrices } = useModification();
  const { ticket } = useTicketDetail();

  useEffect(() => {
    if (seatRows.length > 0 && seatPrices) return;

    async function load() {
      const [r, p] = await Promise.all([getSeatRows(), getSeatPrices()]);
      setSeatRows(r);
      setSeatPrices(p);
    }
    load();
  }, [seatRows.length, seatPrices, setSeatRows, setSeatPrices]);

  const handleToggle = useCallback(
    (rowLabel: string, seat: Seat) => {
      if (!seatPrices) return;
      if (seat.status === "occupied") return;

      const label = getSeatLabel(rowLabel, seat);
      const type =
        seat.kind === "available"
          ? translate("booking.seats.standard")
          : seat.kind === "vip"
          ? "VIP"
          : "SweetBox";
      const price = seatPrices[seat.kind as keyof SeatPrice];

      toggleSeat({ label, type, price });
    },
    [seatPrices, toggleSeat, translate]
  );

  if (!seatPrices || seatRows.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-(--color-text-muted)">
        Loading seat map...
      </div>
    );
  }

  const selectedLabels = selectedSeats.map((s) => s.label);
  const originalLabels = ticket.seatItems.map((s) => s.label);

  return (
    <SeatGrid
      rows={seatRows}
      onToggle={handleToggle}
      selectedLabels={selectedLabels}
      originalLabels={originalLabels}
    />
  );
}
