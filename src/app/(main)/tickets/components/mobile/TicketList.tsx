"use client";

import { useRef, useEffect } from "react";
import { useTickets } from "@/contexts/TicketsContext";
import { UPCOMING, PAST } from "@/features/tickets/mock";
import UpcomingCard from "@/app/(main)/tickets/components/mobile/UpcomingCard";
import PastCard from "@/app/(main)/tickets/components/mobile/PastCard";
import EmptyState from "@/app/(main)/tickets/components/mobile/EmptyState";

export default function TicketList() {
  const { activeTab, visibleCount, loadMore } = useTickets();

  const source = activeTab === "upcoming" ? UPCOMING : PAST;
  const visible = source.slice(0, visibleCount);
  const hasMore = source.length > visibleCount;

  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(visibleCount);

  useEffect(() => {
    if (visibleCount > prevCountRef.current) {
      const list = listRef.current;
      if (list) {
        const cards = list.querySelectorAll<HTMLElement>("[data-ticket-card]");
        const firstNew = cards[prevCountRef.current];
        if (firstNew) {
          firstNew.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    prevCountRef.current = visibleCount;
  }, [visibleCount]);

  return (
    <main ref={listRef} className="flex-1 overflow-y-auto px-4 space-y-4">
      {activeTab === "upcoming" ? (
        visible.length > 0 ? (
          visible.map((ticket, index) => (
            <div
              key={ticket.id}
              data-ticket-card
              className={index >= prevCountRef.current ? "animate-fade-in" : ""}
            >
              <UpcomingCard ticket={ticket} />
            </div>
          ))
        ) : (
          <EmptyState label="No upcoming tickets" />
        )
      ) : (
        visible.map((ticket, index) => (
          <div
            key={ticket.id}
            data-ticket-card
            className={index >= prevCountRef.current ? "animate-fade-in" : ""}
          >
            <PastCard ticket={ticket} />
          </div>
        ))
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-colors bg-transparent border border-(--color-border) text-(--color-text-secondary)"
        >
          {activeTab === "upcoming" ? "Load More" : "Load Older Tickets"}
        </button>
      )}
    </main>
  );
}
