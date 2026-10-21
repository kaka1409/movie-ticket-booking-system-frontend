"use client";

import type { DateOption } from "@/features/booking/types";
import { formatDayOfMonth } from "@/libs/date";

/**
 * Horizontal date chips (not a calendar) for the cinema and modify steps:
 * presentation only — `selected` is the wire value (`YYYY-MM-DD`) and the
 * caller owns the state and the URL sync.
 */
export default function DatePicker({
  dates,
  selected,
  onSelect,
}: {
  dates: DateOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex overflow-x-scroll scrollbar-hide gap-2 pb-1">
      {dates.map((dateOption) => {
        const active = selected === dateOption.value;
        return (
          <button
            type="button"
            key={dateOption.value}
            onClick={() => onSelect(dateOption.value)}
            aria-pressed={active}
            className={`shrink-0 flex flex-col items-center justify-center w-17 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.97] border ${
              active
                ? "bg-(--color-gold) border-(--color-gold) shadow-(--shadow-glow)"
                : "bg-(--color-surface) border-(--color-border)"
            }`}
          >
            <span
              className={`text-[9px] font-bold tracking-widest uppercase ${
                active ? "text-(--color-bg)" : "text-(--color-text-muted)"
              }`}
            >
              {dateOption.weekday}
            </span>
            <span
              className={`text-2xl font-extrabold leading-tight ${
                active ? "text-(--color-bg)" : "text-(--color-text-primary)"
              }`}
            >
              {formatDayOfMonth(dateOption.day)}
            </span>
            <span
              className={`text-[9px] font-semibold tracking-widest ${
                active ? "text-[#0F0F0F99]" : "text-(--color-text-muted)"
              }`}
            >
              {dateOption.month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
