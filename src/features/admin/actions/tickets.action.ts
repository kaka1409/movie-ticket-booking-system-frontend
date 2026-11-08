"use server";

import { mutateAdmin } from "../api/mutation";
import type { AdminActionResult, AdminCheckinResult } from "../types";

/**
 * Gate scan. This is the one console write that is JWT-only (no cookie fallback
 * on the backend), so the caller must pass `useAuth().token` — the same RAM
 * bearer the rest of the console uses.
 *
 * Failures are answers, not errors: `409` means the ticket is already used,
 * expired or outside its check-in window, and the payload is worth showing to
 * the operator at the door.
 */
export async function checkInTicketAction(
  token: string,
  payload: string,
): Promise<AdminActionResult<AdminCheckinResult>> {
  return mutateAdmin<AdminCheckinResult>("POST", "/admin/tickets/check-in", token, { payload });
}
