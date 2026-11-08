"use client";

import { useLocale } from "@/contexts/LocaleContext";

const WEEKDAY_KEYS = [
  "admin.showtimes.weekday_sun",
  "admin.showtimes.weekday_mon",
  "admin.showtimes.weekday_tue",
  "admin.showtimes.weekday_wed",
  "admin.showtimes.weekday_thu",
  "admin.showtimes.weekday_fri",
  "admin.showtimes.weekday_sat",
] as const;

/** Horizontal day cards; the badge count comes from the schedule summary. */
export default function ScheduleDateStrip({
  dates,
  counts,
  selected,
  onSelect,
}: {
  dates: string[];
  counts: Map<string, number>;
  selected: string;
  onSelect: (date: string) => void;
}) {
  const { translate } = useLocale();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
      {dates.map((date) => {
        const day = new Date(`${date}T00:00:00.000Z`);
        const isSelected = date === selected;
        const count = counts.get(date) ?? 0;
        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`flex min-w-24 shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition ${
              isSelected
                ? "border-(--color-gold) bg-(--color-gold)/10"
                : "border-(--color-border) bg-(--color-surface) hover:border-(--color-border-strong)"
            }`}
          >
            <span className="text-[10px] font-bold tracking-wider text-(--color-text-muted) uppercase">
              {translate(WEEKDAY_KEYS[day.getUTCDay()])}
            </span>
            <span className="text-sm font-bold tabular-nums text-(--color-text-primary)">
              {date.slice(8, 10)}/{date.slice(5, 7)}/{date.slice(0, 4)}
            </span>
            <span className="mt-0.5 text-[10px] font-bold tabular-nums text-(--color-gold)">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
