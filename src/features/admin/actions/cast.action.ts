"use server";

import { actionFailureFromApiError, apiFetch, toActionFailure } from "@/libs/api";
import { getRequestCookie } from "@/libs/session";
import type { AdminActionResult, AdminCastMember } from "../types";

/**
 * Cast-member catalog reads for pickers (the movie cast dialog searches this
 * list instead of asking the operator to type names by hand).
 */
export async function getCastMembersAction(
  token: string,
  search?: string,
): Promise<AdminActionResult<AdminCastMember[]>> {
  try {
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);

    const result = await apiFetch<{ members: AdminCastMember[] }>(
      `/admin/cast?${params.toString()}`,
      { cache: "no-store" },
      token,
      await getRequestCookie(),
    );

    if ("error" in result) {
      return actionFailureFromApiError(result.error);
    }

    return { success: true, data: result.data.members };
  } catch (error) {
    return toActionFailure(error);
  }
}
