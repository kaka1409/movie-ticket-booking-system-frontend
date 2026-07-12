"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { COUNTDOWN_SECONDS } from "@/features/booking/mock";

function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, expired: seconds <= 0, urgent: seconds <= 60 };
}

export default function CountdownBanner() {
  const { display, urgent } = useCountdown(COUNTDOWN_SECONDS);
  return (
    <div className="mx-4 flex items-center justify-between px-4 py-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
      <div className="flex items-center gap-2 text-sm font-medium text-(--color-text-secondary)">
        <Timer size={15} className="text-(--color-gold)" />
        Time remaining
      </div>
      <span
        className={`font-extrabold text-lg tabular-nums tracking-tight ${
          urgent ? "text-red-400" : "text-red-300"
        }`}
      >
        {display}
      </span>
    </div>
  );
}
