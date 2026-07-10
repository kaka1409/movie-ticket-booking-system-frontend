"use client";

import { DateOption } from "@/features/booking/types";

export default function DatePicker({
  dates,
  selected,
  onSelect,
}: {
  dates: DateOption[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex overflow-x-scroll scrollbar-hide gap-2 pb-1">
      {dates.map((d) => {
        const active = selected === d.value;
        return (
          <button
            key={d.value}
            onClick={() => onSelect(d.value)}
            aria-pressed={active}
            className={`shrink-0 flex flex-col items-center justify-center w-17 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.97] border ${
              active
                ? "bg-(--color-gold) border-(--color-gold) shadow-(--shadow-glow)"
                : "bg-(--color-surface) border-(--color-border)"
            }`}
          >
            <span
              className={`text-[9px] font-bold tracking-widest uppercase ${
                active ? "text-[#0F0F0F]" : "text-(--color-text-muted)"
              }`}
            >
              {d.weekday}
            </span>
            <span
              className={`text-2xl font-extrabold leading-tight ${
                active ? "text-[#0F0F0F]" : "text-(--color-text-primary)"
              }`}
            >
              {d.day}
            </span>
            <span
              className={`text-[9px] font-semibold tracking-widest ${
                active ? "text-[#0F0F0F99]" : "text-(--color-text-muted)"
              }`}
            >
              {d.month}
            </span>
          </button>
        );
      })}
    </div>
  );
}
