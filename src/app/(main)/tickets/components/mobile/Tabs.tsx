"use client";

import { useTickets } from "@/contexts/TicketsContext";

export default function Tabs() {
  const { activeTab, setActiveTab } = useTickets();

  return (
    <div className="flex gap-0 border-b border-(--color-border) px-(--space-md)">
      {(["upcoming", "past"] as const).map((tab) => {
        const label = tab === "upcoming" ? "Upcoming Tickets" : "Past Tickets";
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative mr-6 pb-3 px-1 text-sm font-bold tracking-wide transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
            )}
          </button>
        );
      })}
    </div>
  );
}
