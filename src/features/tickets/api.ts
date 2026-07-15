import type { UpcomingTicket, PastTicket } from "./types";
// import { apiFetch } from "@/libs/api";
import { UPCOMING, PAST } from "./mock";

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
