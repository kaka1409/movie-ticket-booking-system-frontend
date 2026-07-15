"use client";

import { useRef, useEffect } from "react";
import { useTickets } from "@/features/tickets/context";
import type { UpcomingTicket } from "@/features/tickets/types";
import UpcomingCard from "@/app/(main)/tickets/components/mobile/UpcomingCard";
import EmptyState from "@/app/(main)/tickets/components/mobile/EmptyState";

export default function UpcomingTicketList({
  tickets,
}: {
  tickets: UpcomingTicket[];
}) {
  const { activeTab, visibleCount, loadMore } = useTickets();

  const hasMore = tickets.length > visibleCount;

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

  if (activeTab !== "upcoming") return null;

  if (tickets.length === 0) {
    return <EmptyState label="No upcoming tickets" />;
  }

  return (
    <main ref={listRef} className="flex-1 overflow-y-auto px-4 space-y-4">
      {tickets.slice(0, visibleCount).map((ticket, index) => (
        <div
          key={ticket.id}
          data-ticket-card
          className={index >= prevCountRef.current ? "animate-fade-in" : ""}
        >
          <UpcomingCard ticket={ticket} />
        </div>
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-colors bg-transparent border border-(--color-border) text-(--color-text-secondary)"
        >
          Load More
        </button>
      )}
    </main>
  );
}
