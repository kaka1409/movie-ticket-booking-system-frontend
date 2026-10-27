"use server";

import { mutateAdmin } from "../mutation";
import type {
  AdminActionResult,
  AdminShowtime,
  AdminShowtimeCreateInput,
  AdminShowtimeInput,
} from "../types";

/** Answers `409 SHOWTIME_CONFLICT` when the room is already booked at that time. */
export async function createShowtimeAction(
  token: string,
  input: AdminShowtimeCreateInput,
): Promise<AdminActionResult<AdminShowtime>> {
  return mutateAdmin<AdminShowtime>("POST", "/showtimes", token, input);
}

/** Answers `409 SHOWTIME_IN_USE` while live bookings point at the slot. */
export async function updateShowtimeAction(
  token: string,
  id: string,
  input: AdminShowtimeInput,
): Promise<AdminActionResult<AdminShowtime>> {
  return mutateAdmin<AdminShowtime>("PATCH", `/showtimes/${id}`, token, input);
}

export async function deleteShowtimeAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/showtimes/${id}`, token);
}
