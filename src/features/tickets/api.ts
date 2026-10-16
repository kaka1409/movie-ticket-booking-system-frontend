import type { ApiResponse } from "@/libs/api";
import { apiFetch } from "@/libs/api";
import type { UpcomingTicket, PastTicket, Recipient, EligibleShowtime } from "./types";
import { CANCELLATION_FEE } from "./constants";
import { UPCOMING, PAST, MOCK_RECIPIENTS, MOCK_ELIGIBLE_SHOWTIMES } from "./mock";
import type { TicketDetailWire, TicketPageMeta, TicketSummaryWire } from "./adapters";
import { toDetailTicket, toPastTicket, toUpcomingTicket } from "./adapters";

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

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked) */
export async function findRecipient(query: string, cookie?: string): Promise<Recipient | null> {
  const normalized = query.trim().toLowerCase().replace(/^@/, "");
  if (!normalized) return null;
  return (
    MOCK_RECIPIENTS.find(
      (recipient) =>
        recipient.username.toLowerCase() === normalized ||
        recipient.email.toLowerCase() === normalized,
    ) ?? null
  );
}

export async function searchRecipients(query: string): Promise<Recipient[]> {
  const normalized = query.trim().toLowerCase().replace(/^@/, "");
  if (!normalized) return MOCK_RECIPIENTS;
  return MOCK_RECIPIENTS.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(normalized) ||
      recipient.username.toLowerCase().includes(normalized) ||
      recipient.email.toLowerCase().includes(normalized),
  );
}

/* ─── Modification Queries ──────────────────────────────── */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- ticketId is reserved for the real API call (currently mocked) */
export async function getEligibleShowtimes(ticketId?: string): Promise<EligibleShowtime[]> {
  return MOCK_ELIGIBLE_SHOWTIMES;
}

/* ─── Cancel & Refund API ────────────────────────────────── */

export async function cancelTicket(ticketId: string): Promise<{
  success: boolean;
  refundStatus: "processing" | "failed";
  refundAmount: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const ticket = [...UPCOMING, ...PAST].find((entry) => entry.id === ticketId);
  const ticketTotal = ticket?.seatItems.reduce((sum, seat) => sum + seat.price, 0) ?? 0;
  const snackTotal = ticket?.foodDrink?.reduce((sum, f) => sum + f.price * f.qty, 0) ?? 0;
  const isFailed = Math.random() < 0.3;
  return {
    success: true,
    refundStatus: isFailed ? "failed" : "processing",
    refundAmount: ticketTotal + snackTotal - CANCELLATION_FEE,
  };
}
