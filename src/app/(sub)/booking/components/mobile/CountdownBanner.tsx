"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";

function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export default function CountdownBanner() {
  const { countdownStarted, countdownStartTime, countdownSeconds, holdExpiresAt } = useBooking();
  const { translate } = useLocale();

  // Seed from wall-clock time rather than tick counts: background tabs
  // throttle setInterval, and an absolute deadline stays correct there.
  // `holdExpiresAt` (BE) wins over the local first-selection fallback.
  const initialDeadline =
    holdExpiresAt ?? (countdownStarted ? countdownStartTime + countdownSeconds * 1000 : null);

  const [remaining, setRemaining] = useState(() =>
    initialDeadline === null ? countdownSeconds : secondsUntil(initialDeadline),
  );

  useEffect(() => {
    if (initialDeadline === null) return;

    const tick = () => setRemaining(secondsUntil(initialDeadline));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [initialDeadline]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
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
        {expired ? "00:00" : `${minutes}:${seconds}`}
      </span>
    </div>
  );
}
