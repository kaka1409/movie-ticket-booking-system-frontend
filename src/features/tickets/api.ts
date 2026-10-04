import type { UpcomingTicket, PastTicket, Recipient, EligibleShowtime } from "./types";
// import { apiFetch } from "@/libs/api";

import { UPCOMING, PAST, MOCK_RECIPIENTS, MOCK_ELIGIBLE_SHOWTIMES } from "./mock";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked) */
export async function getUpcomingTickets(cookie?: string): Promise<UpcomingTicket[]> {
  // TODO: replace with real fetch when backend is ready
  // const response = await apiFetch<UpcomingTicket[]>("/tickets/upcoming", undefined, undefined, cookie);
  // if ("error" in response) return [];
  // return response.data;
  return UPCOMING;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked) */
export async function getPastTickets(cookie?: string): Promise<PastTicket[]> {
  // const response = await apiFetch<PastTicket[]>("/tickets/past", undefined, undefined, cookie);
  // if ("error" in response) return [];
  // return response.data;
  return PAST;
}

export async function getTicketById(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- cookie is reserved for the real API call (currently mocked)
  cookie?: string,
): Promise<UpcomingTicket | PastTicket | undefined> {
  const allTickets = [...UPCOMING, ...PAST];
  return allTickets.find((ticket) => ticket.id === id);

  // const response = await apiFetch<UpcomingTicket | PastTicket>(`/tickets/${id}`, undefined, undefined, cookie);
  // if ("error" in response) return undefined;
  // return response.data;
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

  // const response = await apiFetch<Recipient | null>(
  //   `/tickets/recipients/find?q=${encodeURIComponent(query)}`,
  //   undefined,
  //   undefined,
  //   cookie,
  // );
  // if ("error" in response) return null;
  // return response.data;
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

  // const response = await apiFetch<{ data: Recipient[] }>(
  //   `/tickets/recipients/search?q=${encodeURIComponent(query)}`,
  // );
  // return response.data;
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
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<{ success: boolean; refundStatus: string; refundAmount: number }>(
  //   `/api/v1/tickets/${ticketId}/cancel`,
  //   { method: "POST" }
  // );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const ticket = [...UPCOMING, ...PAST].find((t) => t.id === ticketId);
  const ticketTotal = ticket?.seatItems.reduce((sum, seat) => sum + seat.price, 0) ?? 0;
  const snackTotal = ticket?.foodDrink?.reduce((sum, f) => sum + f.price * f.qty, 0) ?? 0;
  const isFailed = Math.random() < 0.3;
  return {
    success: true,
    refundStatus: isFailed ? "failed" : "processing",
    refundAmount: ticketTotal + snackTotal - 20000,
  };
}
