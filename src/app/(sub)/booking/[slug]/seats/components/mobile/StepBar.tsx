"use client";

import { BOOKING_STEPS } from "@/features/booking/types";

export default function StepBar({ current }: { current: number }) {
  return (
    <div className="px-4 pt-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest text-(--color-text-muted)">
          STEP {current} OF {BOOKING_STEPS.length}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-(--color-gold)">
          {BOOKING_STEPS[current - 1]}
        </span>
      </div>
      <div className="flex gap-1.5">
        {BOOKING_STEPS.map((_, i) => (
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
