"use client";

import { Timer } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatCountdown, useCountdownRemaining } from "@/features/booking/countdown";

/**
 * Session countdown chip. The clock itself lives in `CountdownProvider`, mounted
 * once by the booking layout — this component only paints the value, so the
 * mobile banner and the desktop rail share a single 1-second timer.
 */
export default function CountdownBanner() {
  const { translate } = useLocale();
  const remaining = useCountdownRemaining();

  const urgent = remaining <= 60 && remaining > 0;
  const expired = remaining <= 0;

  return (
    <div className="mx-4 flex items-center justify-between px-4 py-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
      <div className="flex items-center gap-2 text-sm font-medium text-(--color-text-secondary)">
        <Timer size={15} className="text-(--color-gold)" />
        {expired
          ? translate("booking.common.time_expired")
          : translate("booking.common.time_remaining")}
      </div>
      <span
        className={`font-extrabold text-lg tabular-nums tracking-tight ${
          expired ? "text-red-500" : urgent ? "text-red-400" : "text-red-300"
        }`}
      >
        {expired ? "00:00" : formatCountdown(remaining)}
      </span>
    </div>
  );
}
