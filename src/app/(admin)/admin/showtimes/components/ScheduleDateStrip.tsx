"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { toLocaleTag } from "@/libs/utils";

const WEEKDAY_KEYS = [
  "admin.showtimes.weekday_sun",
  "admin.showtimes.weekday_mon",
  "admin.showtimes.weekday_tue",
  "admin.showtimes.weekday_wed",
  "admin.showtimes.weekday_thu",
  "admin.showtimes.weekday_fri",
  "admin.showtimes.weekday_sat",
] as const;

/** Horizontal day chips styled like the public movie-detail picker. */
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
  const { translate, locale } = useLocale();

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold tracking-wider text-(--color-text-muted) uppercase">
        {translate("admin.showtimes.date")}
      </p>
      <div className="flex flex-wrap gap-2">
        {dates.map((date) => {
          const day = new Date(`${date}T00:00:00.000Z`);
          const isSelected = date === selected;
          const count = counts.get(date) ?? 0;
          const weekday = translate(WEEKDAY_KEYS[day.getUTCDay()]);
          const dayOfMonth = day.getUTCDate();
          const month = day
            .toLocaleDateString(toLocaleTag(locale), { month: "short" })
            .toUpperCase();

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              className={`shrink-0 flex flex-col items-center justify-center w-17 py-2.5 rounded-xl transition duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) border ${
                isSelected
                  ? "bg-(--color-gold) border-(--color-gold) shadow-(--shadow-glow)"
                  : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/50"
              }`}
            >
              <span
                className={`text-3xs font-bold tracking-widest uppercase ${
                  isSelected ? "text-(--color-bg)" : "text-(--color-text-muted)"
                }`}
              >
                {weekday}
              </span>
              <span
                className={`text-2xl font-extrabold leading-tight ${
                  isSelected ? "text-(--color-bg)" : "text-(--color-text-primary)"
                }`}
              >
                {String(dayOfMonth).padStart(2, "0")}
              </span>
              <span
                className={`text-3xs font-semibold tracking-widest ${
                  isSelected ? "text-[#0F0F0F99]" : "text-(--color-text-muted)"
                }`}
              >
                {month}
              </span>
              {count > 0 && (
                <span
                  className={`absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${
                    isSelected
                      ? "bg-(--color-bg) text-(--color-gold)"
                      : "bg-(--color-gold) text-black"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
