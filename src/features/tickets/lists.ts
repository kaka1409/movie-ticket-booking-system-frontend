import { cache } from "react";
import { settleApiResponse } from "@/libs/api";
import type { ErrorResponse } from "@/libs/api";
import { getPastTickets, getUpcomingTickets } from "./api";
import type { TicketPageMeta } from "./adapters";
import type { PastTicket, UpcomingTicket } from "./types";

export type TicketTab = "upcoming" | "past";

/** Pager defaults for an empty/failed page, shared by the list sections. */
export const DEFAULT_TICKET_META: TicketPageMeta = {
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 12,
  hasNextPage: false,
};

/** One tab's rows, in the shape both device trees and the pager read. */
export interface TicketListData {
  upcoming: UpcomingTicket[];
  past: PastTicket[];
  meta: TicketPageMeta;
  error: ErrorResponse["error"] | null;
  /** A dead session renders nothing — `ProtectedRoute` owns the login prompt. */
  isUnauthorized: boolean;
}

/**
 * Rows of the visible tab. The two device trees read this in separate Suspense
 * boundaries, so `cache()` keeps them at one backend call per request; only the
 * active tab is fetched at all (the other list stays empty).
 */
export const getTicketsForTab = cache(
  async (
    tab: TicketTab,
    page: number,
    cookie: string | undefined,
    locale: "en" | "vn",
  ): Promise<TicketListData> => {
    const result =
      tab === "past"
        ? await settleApiResponse(getPastTickets(page, cookie, locale))
        : await settleApiResponse(getUpcomingTickets(page, cookie, locale));

    if ("error" in result) {
      return {
        upcoming: [],
        past: [],
        meta: DEFAULT_TICKET_META,
        error: result.error,
        isUnauthorized: result.error.status === 401,
      };
    }

    return {
      upcoming: tab === "past" ? [] : (result.data as UpcomingTicket[]),
      past: tab === "past" ? (result.data as PastTicket[]) : [],
      meta: result.meta ?? DEFAULT_TICKET_META,
      error: null,
      isUnauthorized: false,
    };
  },
);
