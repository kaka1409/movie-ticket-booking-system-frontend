import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminCastMember, AdminPaginationMeta } from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

/** Paginated cast-member catalog — `search` filters by actor name. */
export async function getAdminCastMembers(params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<AdminCastMember[], AdminPaginationMeta>> {
  const query = buildAdminQuery({
    search: params.search,
    page: params.page,
    limit: params.limit,
  });

  const result = await apiFetch<
    { members: AdminCastMember[] },
    AdminPaginationMeta
  >(`/admin/cast${query}`, ADMIN_NO_STORE, undefined, await adminCookie());

  if ("error" in result) return result;

  return {
    data: result.data.members,
    meta: result.meta,
  };
}
