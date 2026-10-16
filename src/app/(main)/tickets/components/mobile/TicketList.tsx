"use client";

import type { ReactNode } from "react";
import EmptyState from "@/app/(main)/tickets/components/mobile/EmptyState";

interface TicketListProps<T extends { id: string | number }> {
  /** One server-fetched page — rendered whole, no client slicing. */
  tickets: T[];
  /** Empty-state text (caller passes the translated label for its tab). */
  emptyLabel: string;
  /** Renders the tab-specific card for one ticket. */
  renderCard: (ticket: T) => ReactNode;
}

/**
 * Shared ticket list for the tickets page (upcoming + past tabs).
 * Pagination lives in the URL (`?tab=&page=`) — the page server-fetches one
 * page and the pager navigates, so there is no "load more" state here.
 */
export default function TicketList<T extends { id: string | number }>({
  tickets,
  emptyLabel,
  renderCard,
}: TicketListProps<T>) {
  if (tickets.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} data-ticket-card>
          {renderCard(ticket)}
        </div>
      ))}
    </main>
  );
}
