"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { Seat } from "@/features/booking/types";

/**
 * One seat/square button. A sweetbox cell prints the tail of `pairId`
 * (`<kind>-<label>`, so the label may contain dashes). `originalIndicator`
 * rings a seat the modify flow started with, so the viewer sees what changed.
 */
export default function SeatCell({
  seat,
  onToggle,
  disabled = false,
  originalIndicator = false,
  size = "sm",
  legendMode = false,
}: {
  seat: Seat;
  onToggle: (seat: Seat) => void;
  disabled?: boolean;
  originalIndicator?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  legendMode?: boolean;
}) {
  const occupied = seat.status === "occupied";
  const selected = seat.status === "selected";
  const { translate } = useLocale();

  if (seat.kind === "sweetbox") {
    const pairLabel = seat.pairId?.split("-").slice(1).join("-") ?? "";
    const sizeClasses = {
      xs: "w-12 h-5",
      sm: "w-18.5 h-8",
      md: "w-24 h-10",
      lg: "w-28 h-12",
      xl: "w-32 h-14",
    };
    return (
      <button
        type="button"
        disabled={disabled || occupied}
        onClick={() => {
          if (!occupied && !disabled) onToggle(seat);
        }}
        aria-pressed={selected}
        aria-label={`${translate("booking.seats.sweetbox")} ${pairLabel}`}
        className={`${sizeClasses[size || "sm"]} rounded-sm text-[11px] font-bold tracking-wide transition duration-150 active:scale-[0.95] ${
          occupied
            ? "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-muted) line-through cursor-not-allowed"
            : selected
              ? "bg-(--color-gold) text-(--color-bg) shadow-[0_0_10px_rgba(255,204,77,0.35)]"
              : "bg-pink-500 text-white hover:brightness-110"
        }`}
      >
        {occupied ? "×" : legendMode ? "" : pairLabel}
      </button>
    );
  }

  const baseAvail =
    "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-secondary) hover:border-(--color-gold)/50";
  const baseOcc =
    "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-muted) cursor-not-allowed";
  const baseSel = "bg-(--color-gold) text-(--color-bg) shadow-[0_0_8px_rgba(255,204,77,0.3)]";
  const baseVip = "bg-amber-700 text-white hover:brightness-110";

  let cls = "";
  if (occupied) cls = baseOcc;
  else if (selected) cls = baseSel;
  else if (seat.kind === "vip") cls = baseVip;
  else cls = baseAvail;

  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-6.5 h-6.5",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  return (
    <button
      type="button"
      disabled={disabled || occupied}
      onClick={() => {
        if (!occupied && !disabled) onToggle(seat);
      }}
      aria-pressed={selected}
      aria-label={`${translate("booking.seats.seat_label")} ${seat.col}`}
      className={`relative ${sizeClasses[size || "sm"]} rounded-sm text-[11px] font-bold transition duration-150 active:scale-[0.92] ${cls} ${
        originalIndicator && !selected ? "ring-1 ring-white/30" : ""
      }`}
    >
      {occupied ? "×" : legendMode ? "" : seat.col}
      {originalIndicator && !selected && !occupied && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40" />
      )}
    </button>
  );
}
