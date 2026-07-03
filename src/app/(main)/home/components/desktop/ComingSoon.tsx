"use client";

import { Bell, ChevronLeft, ChevronRight } from "lucide-react";

const COMING_SOON = [
  {
    id: 1, title: "Quantum Realm", label: "Upcoming Blockbuster", date: "NOV 15",
    gradient: "linear-gradient(160deg,#1a0800 0%,#3d1000 50%,#0d0500 100%)",
  },
  {
    id: 2, title: "The Last Samurai", label: "Upcoming Blockbuster", date: "DEC 02",
    gradient: "linear-gradient(160deg,#0a0808 0%,#2a1a10 50%,#080604 100%)",
  },
  {
    id: 3, title: "Frostbite", label: "Upcoming Blockbuster", date: "DEC 24",
    gradient: "linear-gradient(160deg,#000d1a 0%,#001a33 50%,#000508 100%)",
  },
];

export default function ComingSoon() {
  return (
    <section className="mx-auto max-w-7xl px-8 pt-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[26px] font-black tracking-tight text-white">
            COMING SOON
          </h2>
          <span className="rounded-(--radius-pill) border border-(--color-border) px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-(--color-text-muted)">
            WINTER SEASON 2026
          </span>
        </div>
        <div className="flex gap-2">
          {[<ChevronLeft key="l" size={16} />, <ChevronRight key="r" size={16} />].map(
            (icon, i) => (
              <button
                key={i}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface) text-white"
              >
                {icon}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        {COMING_SOON.map((film) => (
          <article key={film.id} className="cursor-pointer overflow-hidden rounded-(--radius-lg)">
            <div
              className="relative flex aspect-[16/9] w-full flex-col justify-between p-4"
              style={{ background: film.gradient }}
            >
              <span className="self-start rounded-(--radius-sm) bg-(--color-gold) px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-black">
                {film.date}
              </span>
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[9px] font-bold tracking-widest uppercase text-white/45">
                    {film.label}
                  </p>
                  <h3 className="text-lg font-extrabold tracking-tight text-white">{film.title}</h3>
                </div>
                <button
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-(--color-gold) text-black"
                  aria-label={`Notify me about ${film.title}`}
                >
                  <Bell size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="cursor-pointer rounded-(--radius-pill) border border-(--color-border) bg-transparent px-7 py-2.5 text-[13px] font-semibold text-white">
          Pre-book Tickets for Future Releases
        </button>
      </div>
    </section>
  );
}
