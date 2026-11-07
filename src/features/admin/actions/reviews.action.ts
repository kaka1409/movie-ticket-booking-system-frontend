"use server";

import { mutateAdmin } from "../mutation";
import type { AdminActionResult } from "../types";

/**
 * Moderation is soft delete on both ends: `DELETE` hides the review from every
 * public read but keeps the row, and `restore` puts it back. An admin deleting
 * someone else's review therefore never destroys the member's words.
 */
export async function deleteAdminReviewAction(
  token: string,
  reviewId: string,
): Promise<AdminActionResult<{ id: string; deleted: boolean }>> {
  return mutateAdmin<{ id: string; deleted: boolean }>("DELETE", `/reviews/${reviewId}`, token);
}

export async function restoreAdminReviewAction(
  token: string,
  reviewId: string,
): Promise<AdminActionResult<{ id: string }>> {
  return mutateAdmin<{ id: string }>("PATCH", `/admin/reviews/${reviewId}/restore`, token);
}
