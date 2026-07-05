"use client";

import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { DATES, CINEMAS } from "../shared/mock";

export default function Showtimes() {
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedTimes, setSelectedTimes] = useState<Record<number, string>>({
    1: "6:15 PM",
  });

  const toggleTime = (cinemaId: number, time: string) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [cinemaId]: prev[cinemaId] === time ? "" : time,
    }));
  };

  return (
    <section className="px-4">
      <SectionHeading>Showtimes</SectionHeading>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {DATES.map((date) => {
          const active = selectedDate === date.value;
          return (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`
                shrink-0 flex flex-col items-center justify-center
                w-14 rounded-xl py-2 border transition-all duration-150
                ${
                  active
                    ? "bg-(--color-gold) border-(--color-gold) shadow-[0_0_12px_rgba(255,204,77,0.3)]"
                    : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/40"
                }
              `}
              aria-pressed={active}
            >
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  active ? "text-(--color-bg)" : "text-(--color-text-muted)"
                }`}
              >
                {date.label}
              </span>
              <span
                className={`text-xl font-extrabold leading-tight ${
                  active
                    ? "text-(--color-bg)"
                    : "text-(--color-text-primary)"
                }`}
              >
                {date.day}
              </span>
            </button>
          );
        })}

        {/*NO NOT DELETE*/}
        {/*<button className="shrink-0 w-14 rounded-xl border border-(--color-border) bg-(--color-surface) flex items-center justify-center hover:border-(--color-gold)/40 transition-colors">
          <Calendar size={18} className="text-(--color-text-muted)" />
        </button>*/}
      </div>

      <div className="space-y-4">
        {CINEMAS.map((cinema) => (
          <div
            key={cinema.id}
            className="rounded-2xl bg-(--color-surface) border border-(--color-border) p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-(--color-text-primary) font-bold text-sm">
                  {cinema.name}
                </p>
                <p className="flex items-center gap-1 text-(--color-text-muted) text-xs mt-0.5">
                  <MapPin size={11} /> {cinema.distance}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md ${cinema.badgeColor}`}
              >
                {cinema.badge}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {cinema.times.map((t) => {
                const active = selectedTimes[cinema.id] === t;
                return (
                  <button
                    key={t}
                    onClick={() => toggleTime(cinema.id, t)}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                      ${
                        active
                          ? "bg-(--color-gold) border-(--color-gold) text-(--color-bg) shadow-[0_0_10px_rgba(255,204,77,0.25)]"
                          : "bg-(--color-surface-2) border-(--color-border) text-(--color-text-primary) hover:border-(--color-gold)/40"
                      }
                    `}
                    aria-pressed={active}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
