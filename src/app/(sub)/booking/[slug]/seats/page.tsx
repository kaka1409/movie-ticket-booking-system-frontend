"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ALL_MOVIES } from "@/features/movies/mock";
import { SEAT_ROWS, MAX_SEATS_PER_BOOKING } from "@/features/booking/mock";
import type { Seat, SeatRow } from "@/features/booking/types";
import { useBooking } from "@/contexts/BookingContext";

import StepBar from "@/app/(sub)/booking/components/mobile/StepBar";
import CountdownBanner from "@/app/(sub)/booking/components/mobile/CountdownBanner";
import SeatMap from "./components/mobile/SeatMap";
import Legend from "./components/mobile/Legend";
import BottomBar from "./components/mobile/BottomBar";

import DesktopSeatContent from "./components/desktop/SeatContent";

function restoreSelectedSeats(base: SeatRow[], savedSeats: { label: string }[]): SeatRow[] {
  if (savedSeats.length === 0) return base;
  return base.map((row) => ({
    ...row,
    segments: row.segments.map((seg) =>
      seg.map((seat) => {
        const label =
          seat.kind === "sweetbox"
            ? `${row.label}(${seat.pairId?.split("-").slice(1).join("-")})`
            : `${row.label}${seat.col}`;
        const found = savedSeats.some((s) => s.label === label);
        return found ? { ...seat, status: "selected" as const } : seat;
      })
    ),
  }));
}

export default function SelectSeatPage() {
  const params = useParams();
  const slug = params.slug as string;
  const movie = ALL_MOVIES.find((m) => m.slug === slug);
  const { selectedSeats: savedSeats, startCountdown } = useBooking();

  const [rows, setRows] = useState<SeatRow[]>(() =>
    restoreSelectedSeats(SEAT_ROWS, savedSeats)
  );

  const handleToggle = useCallback((rowLabel: string, clickedSeat: Seat) => {
    setRows((prev) => {
      const selectedCount = prev.flatMap((r) => r.segments.flat()).filter((s) => s.status === "selected").length;
      const isDeselecting = prev
        .find((r) => r.label === rowLabel)
        ?.segments.flat()
        .some((s) => s.kind === clickedSeat.kind && (clickedSeat.kind === "sweetbox" ? s.pairId === clickedSeat.pairId : s.col === clickedSeat.col) && s.status === "selected");

      if (!isDeselecting && selectedCount >= MAX_SEATS_PER_BOOKING) return prev;

      return prev.map((row) => {
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
          segments: row.segments.map((seg) => seg.map(toggleSeat)),
        };
      });
    });
  }, []);

  useEffect(() => {
    const hasSelected = rows.some((r) =>
      r.segments.some((seg) => seg.some((s) => s.status === "selected"))
    );
    if (hasSelected) {
      startCountdown();
    }
  }, [rows, startCountdown]);

  if (!movie) {
    notFound();
  }

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <StepBar current={2} />

        <main className="space-y-5 pt-1 pb-10">
          <CountdownBanner />

          <SeatMap rows={rows} onToggle={handleToggle} />

          <Legend />
        </main>

        <BottomBar rows={rows} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopSeatContent />
      </div>
    </>
  );
}
