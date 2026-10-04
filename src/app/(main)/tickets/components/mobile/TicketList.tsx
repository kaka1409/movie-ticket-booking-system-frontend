"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { useTickets } from "@/features/tickets/context";
import EmptyState from "@/app/(main)/tickets/components/mobile/EmptyState";

interface TicketListProps<T extends { id: string | number }> {
  /** Full ticket list — only the first `visibleCount` entries are rendered. */
  tickets: T[];
  /** Which tickets tab owns this list; renders `null` while another tab is active. */
  tab: "upcoming" | "past";
  /** Empty-state text (caller passes the translated label for its tab). */
  emptyLabel: string;
  /** Pagination button text (differs per tab: "load more" vs "load older"). */
  loadMoreLabel: string;
  /** Renders the tab-specific card for one ticket. */
  renderCard: (ticket: T) => ReactNode;
}

/**
 * Shared ticket list for the tickets page (upcoming + past tabs).
 * "Load more" grows `visibleCount` in TicketsContext; newly revealed cards
 * animate in (threshold = previous count) and the first new card is scrolled
 * into view so the user sees the appended results.
 */
export default function TicketList<T extends { id: string | number }>({
  tickets,
  tab,
  emptyLabel,
  loadMoreLabel,
  renderCard,
}: TicketListProps<T>) {
  const { activeTab, visibleCount, loadMore } = useTickets();

  const hasMore = tickets.length > visibleCount;

  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(visibleCount);
  const [animThreshold, setAnimThreshold] = useState(visibleCount);

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
      setAnimThreshold(prevCountRef.current);
    }
    prevCountRef.current = visibleCount;
  }, [visibleCount]);

  if (activeTab !== tab) return null;

  if (tickets.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <main ref={listRef} className="flex-1 overflow-y-auto px-4 space-y-4">
      {tickets.slice(0, visibleCount).map((ticket, index) => (
        <div
          key={ticket.id}
          data-ticket-card
          className={index >= animThreshold ? "animate-fade-in" : ""}
        >
          {renderCard(ticket)}
        </div>
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-colors bg-transparent border border-(--color-border) text-(--color-text-secondary)"
        >
          {loadMoreLabel}
        </button>
      )}
    </main>
  );
}
