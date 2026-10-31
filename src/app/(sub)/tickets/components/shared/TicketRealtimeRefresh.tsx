"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TICKET_UPDATED_EVENT } from "@/features/notifications/constants";
import { getTicketById } from "@/features/tickets/api";

/** A tab-return flicker must not refetch every time — one run per window. */
const MIN_INTERVAL_MS = 15_000;

/**
 * Keeps the rendered ticket honest when *someone else* changes it: the
 * recipient accepting/declining, or the sender cancelling a transfer. The
 * Socket.IO push (`notification:new` → `TICKET_UPDATED_EVENT`) is the primary
 * trigger; returning to the tab is the safety net for a dropped socket.
 *
 * Mounted with `ticketId` on the detail page, without it on the listing.
 *
 * The detail page re-reads the ticket *before* refreshing: a viewer who lost
 * access (an offer that was cancelled/declined) gets a 404, and refreshing
 * blindly would render the layout's `notFound()` page. That visitor is sent to
 * their ticket list instead. A sender whose deal just settled is still allowed
 * in — they refresh into the "transferred" history view.
 */
export default function TicketRealtimeRefresh({ ticketId }: { ticketId?: string }) {
  const router = useRouter();
  const lastRunRef = useRef(0);

  const revalidate = useCallback(async () => {
    const now = Date.now();
    if (now - lastRunRef.current < MIN_INTERVAL_MS) return;
    lastRunRef.current = now;

    if (!ticketId) {
      router.refresh();
      return;
    }

    // Only the 404-vs-200 answer is used, so the locale is irrelevant.
    const result = await getTicketById(ticketId, undefined, "en");
    if ("error" in result && result.error.status === 404) {
      // The ticket left this viewer (transfer accepted / offer cancelled).
      router.replace("/tickets");
      return;
    }
    router.refresh();
  }, [router, ticketId]);

  useEffect(() => {
    const handleTicketUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ ticketId?: string }>).detail;
      // A notice about another ticket must never refresh this view.
      if (ticketId && detail?.ticketId && detail.ticketId !== ticketId) return;
      void revalidate();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void revalidate();
    };

    window.addEventListener(TICKET_UPDATED_EVENT, handleTicketUpdate);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener(TICKET_UPDATED_EVENT, handleTicketUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [revalidate, ticketId]);

  return null;
}
