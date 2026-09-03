"use server";

import type { UpcomingTicket, PastTicket, Recipient, TicketTransfer, EligibleShowtime, ModificationType, ModificationSeat } from "./types";
// import { apiFetch } from "@/libs/api";
import { UPCOMING, PAST, MOCK_RECIPIENTS, MOCK_ELIGIBLE_SHOWTIMES } from "./mock";

export async function getUpcomingTickets(): Promise<UpcomingTicket[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<UpcomingTicket[]>("/api/v1/tickets/upcoming");
  return UPCOMING;
}

export async function getPastTickets(): Promise<PastTicket[]> {
  // return apiFetch<PastTicket[]>("/api/v1/tickets/past");
  return PAST;
}

export async function getTicketById(id: string): Promise<UpcomingTicket | PastTicket | undefined> {
  // return apiFetch<UpcomingTicket | PastTicket>(`/api/v1/tickets/${id}`);
  const allTickets = [...UPCOMING, ...PAST];
  return allTickets.find((ticket) => ticket.id === id);
}

export async function createTransfer(
  ticketId: string,
  recipient: Recipient,
  seats: string[],
  transferSnacks: boolean
): Promise<UpcomingTicket> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<UpcomingTicket>(`/api/v1/tickets/${ticketId}/transfer`, {
  //   method: "POST",
  //   body: JSON.stringify({ recipient, seats, transferSnacks }),
  // });
  const ticket = UPCOMING.find((t) => t.id === ticketId);
  if (!ticket) throw new Error(`Ticket ${ticketId} not found`);
  const transfer: TicketTransfer = {
    status: "pending",
    recipient,
    transferredSeats: seats,
    transferSnacks,
  };
  ticket.transfer = transfer;
  return ticket;
}

export async function cancelTransfer(ticketId: string): Promise<UpcomingTicket> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<UpcomingTicket>(`/api/v1/tickets/${ticketId}/transfer`, {
  //   method: "DELETE",
  // });
  const ticket = UPCOMING.find((t) => t.id === ticketId);
  if (!ticket) throw new Error(`Ticket ${ticketId} not found`);
  delete ticket.transfer;
  return ticket;
}

export async function findRecipient(query: string): Promise<Recipient | null> {
  const normalized = query.trim().toLowerCase().replace(/^@/, "");
  if (!normalized) return null;
  return (
    MOCK_RECIPIENTS.find(
      (recipient) =>
        recipient.username.toLowerCase() === normalized ||
        recipient.email.toLowerCase() === normalized
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
      recipient.email.toLowerCase().includes(normalized)
  );
}

/* ─── Modification API ─────────────────────────────────────── */

export async function getEligibleShowtimes(
  ticketId: string
): Promise<EligibleShowtime[]> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<EligibleShowtime[]>(`/api/v1/tickets/${ticketId}/eligible-showtimes`);
  const ticket = UPCOMING.find((t) => t.id === ticketId);
  if (!ticket) return [];

  return MOCK_ELIGIBLE_SHOWTIMES.filter(
    (showtime) => showtime.cinemaName !== ticket.cinema
  );
}

export async function modifyTicket(
  ticketId: string,
  modificationType: ModificationType,
  newShowtime?: { date: string; time: string; cinema: string; room: string },
  newSeats?: ModificationSeat[]
): Promise<UpcomingTicket> {
  // TODO: replace with real fetch when backend is ready
  // return apiFetch<UpcomingTicket>(`/api/v1/tickets/${ticketId}/modify`, {
  //   method: "PATCH",
  //   body: JSON.stringify({ modificationType, newShowtime, newSeats }),
  // });
  const ticket = UPCOMING.find((t) => t.id === ticketId);
  if (!ticket) throw new Error(`Ticket ${ticketId} not found`);

  if (newShowtime && (modificationType === "showtime" || modificationType === "both")) {
    ticket.cinema = newShowtime.cinema;
    ticket.room = newShowtime.room;
    ticket.datetime = `${newShowtime.date} ${newShowtime.time}`;
  }

  if (newSeats && (modificationType === "seats" || modificationType === "both")) {
    ticket.seatItems = newSeats.map((s) => ({
      label: s.label,
      type: s.type,
      price: s.price,
    }));
  }

  return ticket;
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
