"use server";

import { apiFetch } from "@/libs/api";
import { mutateAdmin } from "../api/mutation";
import type {
  AdminActionResult,
  AdminSeedShowtimesInput,
  AdminSeedShowtimesResult,
  AdminShowtime,
  AdminShowtimeCreateInput,
  AdminShowtimeInput,
  AdminShowtimeSeats,
} from "../types";

/** Answers `409 SHOWTIME_CONFLICT` when the room is already booked at that time. */
export async function createShowtimeAction(
  token: string,
  input: AdminShowtimeCreateInput,
): Promise<AdminActionResult<AdminShowtime>> {
  return mutateAdmin<AdminShowtime>("POST", "/admin/showtimes", token, input);
}

/** Answers `409 SHOWTIME_IN_USE` while live bookings point at the slot. */
export async function updateShowtimeAction(
  token: string,
  id: string,
  input: AdminShowtimeInput,
): Promise<AdminActionResult<AdminShowtime>> {
  return mutateAdmin<AdminShowtime>("PATCH", `/admin/showtimes/${id}`, token, input);
}

export async function deleteShowtimeAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/showtimes/${id}`, token);
}

/** Auto-program the rolling schedule; `dryRun` previews without inserting. */
export async function seedShowtimesAction(
  token: string,
  input: AdminSeedShowtimesInput,
): Promise<AdminActionResult<AdminSeedShowtimesResult>> {
  return mutateAdmin<AdminSeedShowtimesResult>("POST", "/admin/showtimes/seed", token, input);
}

/** Read-only ops seat map — lazy-loaded when the detail drawer opens. */
export async function getAdminShowtimeSeatsAction(
  token: string,
  id: string,
): Promise<AdminActionResult<AdminShowtimeSeats>> {
  try {
    const result = await apiFetch<AdminShowtimeSeats>(
      `/admin/showtimes/${id}/seats`,
      { cache: "no-store" },
      token,
    );
    if ("error" in result) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: "Network error" };
  }
}
