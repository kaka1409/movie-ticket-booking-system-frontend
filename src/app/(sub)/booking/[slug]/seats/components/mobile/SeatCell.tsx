"use client";

import { Seat } from "@/features/booking/types";
import { useLocale } from "@/contexts/LocaleContext";

export default function SeatCell({
  seat,
  onToggle,
}: {
  seat: Seat;
  onToggle: (seat: Seat) => void;
}) {
  const occupied = seat.status === "occupied";
  const selected = seat.status === "selected";
  const { translate } = useLocale();

  if (seat.kind === "sweetbox") {
    const pairLabel = seat.pairId?.split("-").slice(1).join("-") ?? "";
    return (
      <button
        disabled={occupied}
        onClick={() => !occupied && onToggle(seat)}
        aria-pressed={selected}
        aria-label={`${translate("booking.seats.sweetbox")} ${pairLabel}`}
        className={`w-18.5 h-8 rounded-sm text-[11px] font-bold tracking-wide transition-all duration-150 active:scale-[0.95] ${
          occupied
            ? "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-muted) line-through cursor-not-allowed"
            : selected
            ? "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_10px_rgba(255,204,77,0.35)]"
            : "bg-pink-500 text-white hover:brightness-110"
        }`}
      >
        {occupied ? "×" : pairLabel}
      </button>
    );
  }

  const baseAvail = "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-secondary) hover:border-(--color-gold)/50";
  const baseOcc = "bg-(--color-surface-2) border border-(--color-border) text-(--color-text-muted) cursor-not-allowed";
  const baseSel = "bg-(--color-gold) text-[#0F0F0F] shadow-[0_0_8px_rgba(255,204,77,0.3)]";
  const baseVip = "bg-amber-700 text-white hover:brightness-110";

  let cls = "";
  if (occupied) cls = baseOcc;
  else if (selected) cls = baseSel;
  else if (seat.kind === "vip") cls = baseVip;
  else cls = baseAvail;

  return (
    <button
      disabled={occupied}
      onClick={() => !occupied && onToggle(seat)}
      aria-pressed={selected}
      aria-label={`${translate("booking.seats.seat_label")} ${seat.col}`}
      className={`w-6.5 h-6.5 rounded-sm text-[11px] font-bold transition-all duration-150 active:scale-[0.92] ${cls}`}
    >
      {occupied ? "×" : seat.col}
    </button>
  );
}
