import type { ApiResponse } from "@/libs/api";
import { apiFetch, withLang } from "@/libs/api";
import { getPaymentMethods } from "@/features/booking/api";
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
  const [result, catalog] = await Promise.all([
    apiFetch<TicketDetailWire>(`/tickets/${encodeURIComponent(id)}`, undefined, undefined, cookie),
    getPaymentMethods(locale),
  ]);
  if ("error" in result) return result;
  // The receipt prints the gateway label, and ids are opaque wire values; a
  // catalog outage degrades to readable ids instead of dropping the ticket.
  const paymentMethods = "error" in catalog ? [] : catalog.data.methods;
  return { data: toDetailTicket(result.data, locale, paymentMethods) };
}

/**
 * LIVE - `GET /tickets/:id` read with the RAM Bearer token. A transfer charge
 * that reports success does not say whether the deal settled or was refunded
 * after it closed; ownership is the difference, so the checkout asks whose the
 * ticket is instead of guessing from the attempt.
 */
export function getTicketOwnership(
  ticketId: string,
  token: string,
): Promise<ApiResponse<Pick<TicketDetailWire, "viewerRole">>> {
  return apiFetch<Pick<TicketDetailWire, "viewerRole">>(
    `/tickets/${encodeURIComponent(ticketId)}`,
    undefined,
    token,
  );
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
export async function getRecipient(
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

/**
 * Showtimes this ticket may move to (same movie, outside the change window) —
 * `GET /tickets/:id/modify/eligible-showtimes`. `format` is catalog content, so
 * the read takes the visitor's locale.
 */
export async function getEligibleShowtimes(
  ticketId: string,
  locale: "en" | "vn",
  cookie?: string,
): Promise<ApiResponse<EligibleShowtime[]>> {
  const result = await apiFetch<EligibleShowtimeWire[]>(
    withLang(`/tickets/${encodeURIComponent(ticketId)}/modify/eligible-showtimes`, locale),
    undefined,
    undefined,
    cookie,
  );
  if ("error" in result) return result;
  return { data: result.data.map(toEligibleShowtime) };
}
