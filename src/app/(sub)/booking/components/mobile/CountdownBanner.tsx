"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { COUNTDOWN_SECONDS } from "@/features/booking/mock";

export default function CountdownBanner() {
  const { countdownStarted, countdownStartTime } = useBooking();

  const [remaining, setRemaining] = useState(() => {
    if (!countdownStarted) return COUNTDOWN_SECONDS;
    const elapsed = Math.floor((Date.now() - countdownStartTime) / 1000);
    return Math.max(0, COUNTDOWN_SECONDS - elapsed);
  });

  useEffect(() => {
    if (!countdownStarted) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - countdownStartTime) / 1000);
      setRemaining(Math.max(0, COUNTDOWN_SECONDS - elapsed));
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [countdownStarted, countdownStartTime]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const urgent = remaining <= 60 && remaining > 0;
  const expired = remaining <= 0;

  return (
    <div className="mx-4 flex items-center justify-between px-4 py-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
      <div className="flex items-center gap-2 text-sm font-medium text-(--color-text-secondary)">
        <Timer size={15} className="text-(--color-gold)" />
        {expired ? "Time expired" : "Time remaining"}
      </div>
      <span
        className={`font-extrabold text-lg tabular-nums tracking-tight ${
          expired ? "text-red-500" : urgent ? "text-red-400" : "text-red-300"
        }`}
      >
        {expired ? "00:00" : `${mm}:${ss}`}
      </span>
    </div>
  );
}
