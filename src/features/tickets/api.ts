import type { ApiResponse } from "@/libs/api";
import { apiFetch } from "@/libs/api";
import type { UpcomingTicket, PastTicket, Recipient, EligibleShowtime } from "./types";
import type {
  EligibleShowtimeWire,
  SearchRecipientWire,
  TicketDetailWire,
  TicketPageMeta,
  TicketSummaryWire,
} from "./adapters";
import {
  toDetailTicket,
  toEligibleShowtime,
  toPastTicket,
  toRecipient,
  toUpcomingTicket,
} from "./adapters";

/* ─── Ticket listing & detail (LIVE) ─────────────────────── */

/** Upcoming tickets — paginated (`meta` drives the pager). */
export async function getUpcomingTickets(
  page: number,
  cookie?: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<UpcomingTicket[], TicketPageMeta>> {
  const result = await apiFetch<TicketSummaryWire[], TicketPageMeta>(
    `/tickets/upcoming?page=${page}`,
    undefined,
    undefined,
    cookie,
  );
  if ("error" in result) return result;
  return {
    data: result.data.map((summary) => toUpcomingTicket(summary, locale)),
    meta: result.meta,
  };
}

/** Past tickets — paginated (`meta` drives the pager). */
export async function getPastTickets(
  page: number,
  cookie?: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<PastTicket[], TicketPageMeta>> {
  const result = await apiFetch<TicketSummaryWire[], TicketPageMeta>(
    `/tickets/past?page=${page}`,
    undefined,
    undefined,
    cookie,
  );
  if ("error" in result) return result;
  return {
    data: result.data.map((summary) => toPastTicket(summary, locale)),
    meta: result.meta,
  };
}

/** Ticket detail — an absent ticket surfaces as the backend 404, not `undefined`. */
export async function getTicketById(
  id: string,
  cookie?: string,
  locale: "en" | "vn" = "en",
): Promise<ApiResponse<UpcomingTicket | PastTicket>> {
  const result = await apiFetch<TicketDetailWire>(
    `/tickets/${encodeURIComponent(id)}`,
    undefined,
    undefined,
    cookie,
  );
  if ("error" in result) return result;
  return { data: toDetailTicket(result.data, locale) };
}

/* ─── Transfer recipient (LIVE) ─────────────────────────── */

/**
 * Exact-email recipient lookup — `GET /user/search?email=`. Any failure
 * (unknown email, self, network) resolves to `null`; the caller treats that as
 * "no such recipient" rather than an error state.
 *
 * Client callers pass the RAM `token`; server components pass the forwarded
 * refresh `cookie` (the route accepts Bearer OR refresh cookie).
 */
export async function findRecipient(
  email: string,
  options?: { token?: string; cookie?: string },
): Promise<Recipient | null> {
  const trimmed = email.trim();
  if (!trimmed) return null;

  const result = await apiFetch<SearchRecipientWire>(
    `/user/search?email=${encodeURIComponent(trimmed)}`,
    undefined,
    options?.token,
    options?.cookie,
  );
  if ("error" in result) return null;
  return toRecipient(result.data);
}

/* ─── Modification Queries ──────────────────────────────── */

/** Showtimes this ticket may move to (same movie, >1h out) — `GET /tickets/:id/modify/eligible-showtimes`. */
export async function getEligibleShowtimes(
  ticketId: string,
  cookie?: string,
): Promise<ApiResponse<EligibleShowtime[]>> {
  const result = await apiFetch<EligibleShowtimeWire[]>(
    `/tickets/${encodeURIComponent(ticketId)}/modify/eligible-showtimes`,
    undefined,
    undefined,
    cookie,
  );
  if ("error" in result) return result;
  return { data: result.data.map(toEligibleShowtime) };
}
