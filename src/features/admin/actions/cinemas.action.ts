"use server";

import { actionFailureFromApiError, apiFetch, toActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import { mutateAdmin } from "../api/mutation";
import type {
  AdminActionResult,
  AdminCinema,
  AdminCinemaInput,
  AdminRoom,
  AdminRoomInput,
  AdminSeatLayout,
  AdminSeatLayoutInput,
  AdminSeatType,
} from "../types";

/* ── Cinemas ───────────────────────────────────────────────────────────────── */

export async function createCinemaAction(
  token: string,
  input: AdminCinemaInput,
): Promise<AdminActionResult<AdminCinema>> {
  return mutateAdmin<AdminCinema>("POST", "/admin/cinemas", token, input);
}

export async function updateCinemaAction(
  token: string,
  id: string,
  input: AdminCinemaInput,
): Promise<AdminActionResult<AdminCinema>> {
  return mutateAdmin<AdminCinema>("PATCH", `/admin/cinemas/${id}`, token, input);
}

export async function deleteCinemaAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/cinemas/${id}`, token);
}

/* ── Rooms ─────────────────────────────────────────────────────────────────── */

export async function createRoomAction(
  token: string,
  input: AdminRoomInput & { cinemaId: string; name: string },
): Promise<AdminActionResult<AdminRoom>> {
  return mutateAdmin<AdminRoom>("POST", "/admin/rooms", token, input);
}

export async function updateRoomAction(
  token: string,
  id: string,
  input: AdminRoomInput,
): Promise<AdminActionResult<AdminRoom>> {
  return mutateAdmin<AdminRoom>("PATCH", `/admin/rooms/${id}`, token, input);
}

/** Answers `409 ROOM_IN_USE` once the room has showtimes. */
export async function deleteRoomAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/rooms/${id}`, token);
}

/**
 * Replaces the whole layout in one transaction (config rows + derived seats).
 * Frozen once the room has showtimes — the backend answers `409 ROOM_IN_USE`.
 */
export async function setRoomSeatLayoutAction(
  token: string,
  id: string,
  input: AdminSeatLayoutInput,
): Promise<AdminActionResult<AdminSeatLayout>> {
  return mutateAdmin<AdminSeatLayout>("POST", `/admin/rooms/${id}/seat-layout`, token, input);
}

/* ── Seat types ────────────────────────────────────────────────────────────── */

export async function createSeatTypeAction(
  token: string,
  input: { name: string; basePrice: number },
): Promise<AdminActionResult<AdminSeatType>> {
  return mutateAdmin<AdminSeatType>("POST", "/admin/seat-types", token, input);
}

export async function updateSeatTypeAction(
  token: string,
  id: string,
  input: { name?: string; basePrice?: number },
): Promise<AdminActionResult<AdminSeatType>> {
  return mutateAdmin<AdminSeatType>("PATCH", `/admin/seat-types/${id}`, token, input);
}

export async function deleteSeatTypeAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/admin/seat-types/${id}`, token);
}

/* ── Reads used by the seat-layout editor (on demand) ─────────────────────── */

export async function getAdminSeatTypesAction(
  token: string,
): Promise<AdminActionResult<AdminSeatType[]>> {
  try {
    const result = await apiFetch<AdminSeatType[]>(
      "/admin/seat-types",
      { cache: "no-store" },
      token,
      await getRequestCookie(),
    );

    if ("error" in result) {
      return actionFailureFromApiError(result.error);
    }

    return { success: true, data: result.data };
  } catch (error) {
    return toActionFailure(error);
  }
}

export async function getAdminRoomSeatLayoutAction(
  token: string,
  roomId: string,
): Promise<AdminActionResult<AdminSeatLayout>> {
  try {
    const result = await apiFetch<AdminSeatLayout>(
      `/admin/rooms/${roomId}/seat-layout`,
      { cache: "no-store" },
      token,
      await getRequestCookie(),
    );

    if ("error" in result) {
      return actionFailureFromApiError(result.error);
    }

    return { success: true, data: result.data };
  } catch (error) {
    return toActionFailure(error);
  }
}
