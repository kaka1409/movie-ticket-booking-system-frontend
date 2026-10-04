"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { SeatRow, Seat } from "@/features/booking/types";
import SeatCell from "./SeatCell";
import SeatLegend from "./SeatLegend";

function getSeatLabel(rowLabel: string, seat: Seat): string {
  if (seat.kind === "sweetbox" && seat.pairId) {
    return `${rowLabel}(${seat.pairId.split("-").slice(1).join("-")})`;
  }
  return `${rowLabel}${seat.col}`;
}

export default function SeatGrid({
  rows,
  onToggle,
  selectedLabels = [],
  originalLabels = [],
  showLegend = true,
  showScreen = true,
}: {
  rows: SeatRow[];
  onToggle: (rowLabel: string, seat: Seat) => void;
  selectedLabels?: string[];
  originalLabels?: string[];
  showLegend?: boolean;
  showScreen?: boolean;
}) {
  const { translate } = useLocale();

  const hasExternalSelection = selectedLabels.length > 0;

  return (
    <>
      {showScreen && (
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-(--color-gold) uppercase">
            {translate("booking.common.screen")}
          </span>
          <svg width="300" height="24" viewBox="0 0 260 24" fill="none">
            <path d="M 4 20 Q 130 0 256 20" stroke="rgba(255,204,77,0.8)" strokeWidth="5" />
          </svg>
        </div>
      )}
      <div className="px-2 overflow-x-auto scrollbar-hide">
        <div className="inline-flex flex-col justify-center gap-2 w-full">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-1 justify-between">
              <span className="w-5 text-center text-xs font-bold text-(--color-text-muted) shrink-0">
                {row.label}
              </span>

              <div className="flex gap-1.5">
                {row.segments[0].map((seat, si) => {
                  const label = getSeatLabel(row.label, seat);
                  const effectiveSeat =
                    hasExternalSelection && selectedLabels.includes(label)
                      ? { ...seat, status: "selected" as const }
                      : seat;
                  return (
                    <SeatCell
                      key={`${row.label}-L-${si}`}
                      seat={effectiveSeat}
                      onToggle={(s) => onToggle(row.label, s)}
                      originalIndicator={originalLabels.includes(label)}
                    />
                  );
                })}
              </div>
              <div className="w-3 shrink-0" />
              <div className="flex gap-1.5">
                {row.segments[1].map((seat, si) => {
                  const label = getSeatLabel(row.label, seat);
                  const effectiveSeat =
                    hasExternalSelection && selectedLabels.includes(label)
                      ? { ...seat, status: "selected" as const }
                      : seat;
                  return (
                    <SeatCell
                      key={`${row.label}-R-${si}`}
                      seat={effectiveSeat}
                      onToggle={(s) => onToggle(row.label, s)}
                      originalIndicator={originalLabels.includes(label)}
                    />
                  );
                })}
              </div>

              <span className="w-5 text-center text-xs font-bold text-(--color-text-muted) shrink-0">
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {showLegend && <SeatLegend />}
    </>
  );
}
