"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { BOOKING_STEP_KEYS } from "@/features/booking/types";

export default function StepBar({ current }: { current: number }) {
  const { translate } = useLocale();

  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest text-(--color-text-muted)">
          {translate("booking.step")
            .replace("{current}", String(current))
            .replace("{total}", String(BOOKING_STEP_KEYS.length))}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-(--color-gold)">
          {translate(BOOKING_STEP_KEYS[current - 1])}
        </span>
      </div>
      <div className="flex gap-1.5">
        {BOOKING_STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full overflow-hidden bg-(--color-border)"
          >
            {i < current && (
              <div
                className={`h-full rounded-full w-full ${
                  i === current - 1
                    ? "bg-(--color-gold)"
                    : "bg-(--color-gold-dark)"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
