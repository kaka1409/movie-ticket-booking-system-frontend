"use server";

import { actionFailureFromApiError, apiFetch, toActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import { mutateAdmin } from "../mutation";
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
  return mutateAdmin<AdminCinema>("POST", "/cinemas", token, input);
}

export async function updateCinemaAction(
  token: string,
  id: string,
  input: AdminCinemaInput,
): Promise<AdminActionResult<AdminCinema>> {
  return mutateAdmin<AdminCinema>("PATCH", `/cinemas/${id}`, token, input);
}

export async function deleteCinemaAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/cinemas/${id}`, token);
}

/* ── Rooms ─────────────────────────────────────────────────────────────────── */

export async function createRoomAction(
  token: string,
  input: AdminRoomInput & { cinemaId: string; name: string },
): Promise<AdminActionResult<AdminRoom>> {
  return mutateAdmin<AdminRoom>("POST", "/rooms", token, input);
}

export async function updateRoomAction(
  token: string,
  id: string,
  input: AdminRoomInput,
): Promise<AdminActionResult<AdminRoom>> {
  return mutateAdmin<AdminRoom>("PATCH", `/rooms/${id}`, token, input);
}

/** Answers `409 ROOM_IN_USE` once the room has showtimes. */
export async function deleteRoomAction(
  token: string,
  id: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("DELETE", `/rooms/${id}`, token);
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
  return mutateAdmin<AdminSeatLayout>("POST", `/rooms/${id}/seat-layout`, token, input);
}

/* ── Reads used by the seat-layout editor (on demand) ─────────────────────── */

export async function getAdminSeatTypesAction(
  token: string,
): Promise<AdminActionResult<AdminSeatType[]>> {
  try {
    const result = await apiFetch<AdminSeatType[]>(
      "/seat-types",
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
      `/rooms/${roomId}/seat-layout`,
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
