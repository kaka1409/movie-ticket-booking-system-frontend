"use server";

import { mutateAdmin } from "../api/mutation";
import type { AdminActionResult, AdminUser, AdminUserRole, AdminUserStatus } from "../types";

/**
 * Role and status are separate verbs on the backend because each carries its own
 * guard: a self role change is refused (`403 SELF_ROLE_CHANGE`) and the last
 * administrator can never be demoted or banned.
 */
export async function updateUserRoleAction(
  token: string,
  id: string,
  role: AdminUserRole,
): Promise<AdminActionResult<AdminUser>> {
  return mutateAdmin<AdminUser>("PATCH", `/admin/users/${id}/role`, token, { role });
}

/** Banning also revokes the account's refresh tokens (next refresh gets 403). */
export async function updateUserStatusAction(
  token: string,
  id: string,
  status: AdminUserStatus,
): Promise<AdminActionResult<AdminUser>> {
  return mutateAdmin<AdminUser>("PATCH", `/admin/users/${id}/status`, token, { status });
}
