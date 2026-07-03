"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MOVIES, DATES, SHOWTIMES, CINEMAS } from "@/libs/constants";

interface SelectColProps {
  icon: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
  hint?: string;
}

const SelectCol: React.FC<SelectColProps> = ({ icon, label, value, onChange, options, hint }) => (
  <div className="flex flex-1 flex-col gap-1">
    <span className="text-[9px] font-bold tracking-widest uppercase text-(--color-gold)">
      {icon} {label}
    </span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none border-0 border-b border-(--color-border) bg-transparent pb-2 pr-6 pt-2 text-[13px] font-medium text-white outline-none font-sans"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-(--color-surface)">
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
        <ChevronDown size={14} />
      </span>
    </div>
    {hint && <span className="text-[10px] text-(--color-text-muted)">{hint}</span>}
  </div>
);

const Divider = () => (
  <div className="mt-4 w-px self-stretch bg-(--color-border)" />
);

export default function QuickBookingBar() {
  const [movie, setMovie] = useState(MOVIES[0]);
  const [cinema, setCinema] = useState(CINEMAS[0]);
  const [date, setDate] = useState(DATES[0].value);
  const [showtime, setShowtime] = useState(SHOWTIMES[2]);
  const [tickets, setTickets] = useState(2);

  return (
    <div className="mx-auto max-w-7xl px-8">
      <div
        className="relative z-10 mt-[-24px] rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-7 pb-4 pt-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="mb-4 flex items-start gap-5">
          <SelectCol icon="🎬" label="Select Movie" value={movie} onChange={setMovie} options={MOVIES} />
          <Divider />
          <SelectCol icon="🏛" label="Select Cinema" value={cinema} onChange={setCinema} options={CINEMAS} />
          <Divider />
          <SelectCol icon="📅" label="Select Date" value={date} onChange={setDate} options={DATES.map((d) => d.label)} />
          <Divider />
          <SelectCol icon="⏰" label="Showtime" value={showtime} onChange={setShowtime} options={SHOWTIMES} hint="Next available: 19:00 · 20:15 · 21:30" />
          <Divider />

          <div className="flex shrink-0 flex-col gap-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-(--color-gold)">
              🎟 Tickets
            </span>
            <div className="flex items-center gap-2.5 border-b border-(--color-border) pb-2">
              {[["−", () => setTickets(Math.max(1, tickets - 1))], ["+", () => setTickets(Math.min(8, tickets + 1))]].map(([sym, fn]) => (
                <button
                  key={sym as string}
                  onClick={fn as () => void}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface-2) text-base font-bold text-white"
                >
                  {sym as string}
                </button>
              )).reduce((acc, btn, i) => {
                if (i === 0) {
                  return [btn, <span key="count" className="min-w-5 text-center text-base font-bold text-white">{tickets}</span>];
                }
                return [...acc, btn];
              }, [] as React.ReactNode[])}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-(--color-text-muted)">Estimated Total:</span>
            <span className="text-[22px] font-extrabold tracking-tight text-(--color-gold)">
              ${(tickets * 17.25).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="cursor-pointer border-none bg-transparent text-xs font-semibold text-(--color-text-secondary) underline underline-offset-3">
              View Full Schedule
            </button>
            <button className="cursor-pointer whitespace-nowrap rounded-(--radius-md) border-none bg-(--color-gold) px-6 py-2.5 text-[13px] font-extrabold tracking-wide text-black">
              Quick Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
