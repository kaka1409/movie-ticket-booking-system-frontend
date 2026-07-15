"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Seat, SeatRow } from "@/features/booking/types";
import { useBooking } from "@/features/booking/context";

interface SeatSelectionContextType {
  rows: SeatRow[];
  maxSeats: number;
  handleToggle: (rowLabel: string, seat: Seat) => void;
}

const SeatSelectionContext = createContext<SeatSelectionContextType | null>(null);

function restoreSelectedSeats(base: SeatRow[], savedSeats: { label: string }[]): SeatRow[] {
  if (savedSeats.length === 0) return base;
  return base.map((row) => ({
    ...row,
    segments: row.segments.map((segment) =>
      segment.map((seat) => {
        const label =
          seat.kind === "sweetbox"
            ? `${row.label}(${seat.pairId?.split("-").slice(1).join("-")})`
            : `${row.label}${seat.col}`;
        const found = savedSeats.some((savedSeat) => savedSeat.label === label);
        return found ? { ...seat, status: "selected" as const } : seat;
      })
    ),
  }));
}

export function SeatSelectionProvider({
  initialRows,
  maxSeats,
  children,
}: {
  initialRows: SeatRow[];
  maxSeats: number;
  children: ReactNode;
}) {
  const { selectedSeats: savedSeats, startCountdown } = useBooking();
  const [rows, setRows] = useState<SeatRow[]>(() => restoreSelectedSeats(initialRows, savedSeats));

  const handleToggle = useCallback((rowLabel: string, clickedSeat: Seat) => {
    setRows((previousRows) => {
      const selectedCount = previousRows
        .flatMap((row) => row.segments.flat())
        .filter((seat) => seat.status === "selected").length;
      const isDeselecting = previousRows
        .find((row) => row.label === rowLabel)
        ?.segments.flat()
        .some(
          (seat) =>
            seat.kind === clickedSeat.kind &&
            (clickedSeat.kind === "sweetbox"
              ? seat.pairId === clickedSeat.pairId
              : seat.col === clickedSeat.col) &&
            seat.status === "selected"
        );

      if (!isDeselecting && selectedCount >= maxSeats) return previousRows;

      return previousRows.map((row) => {
        if (row.label !== rowLabel) return row;

        const toggleSeat = (seat: Seat): Seat => {
          const matches =
            clickedSeat.kind === "sweetbox"
              ? seat.pairId === clickedSeat.pairId
              : seat.col === clickedSeat.col && seat.kind === clickedSeat.kind;

          if (!matches) return seat;
          return { ...seat, status: seat.status === "selected" ? "idle" : "selected" };
        };

        return {
          ...row,
          segments: row.segments.map((segment) => segment.map(toggleSeat)),
        };
      });
    });
  }, [maxSeats]);

  useEffect(() => {
    const hasSelected = rows.some((row) =>
      row.segments.some((segment) => segment.some((seat) => seat.status === "selected"))
    );
    if (hasSelected) {
      startCountdown();
    }
  }, [rows, startCountdown]);

  return (
    <SeatSelectionContext.Provider value={{ rows, maxSeats, handleToggle }}>
      {children}
    </SeatSelectionContext.Provider>
  );
}

export function useSeatSelection() {
  const ctx = useContext(SeatSelectionContext);
  if (!ctx) throw new Error("useSeatSelection must be used within SeatSelectionProvider");
  return ctx;
}
