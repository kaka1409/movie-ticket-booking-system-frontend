import { apiFetch, type ApiResponse } from "@/libs/api";
import type { AdminPaginationMeta, AdminUser, AdminUserRole, AdminUserStatus } from "../types";
import { ADMIN_NO_STORE, adminCookie, buildAdminQuery } from "./shared";

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole | "";
  status?: AdminUserStatus | "";
  sort?: string;
  dir?: "asc" | "desc";
}): Promise<ApiResponse<{ users: AdminUser[] }, AdminPaginationMeta>> {
  return apiFetch<{ users: AdminUser[] }, AdminPaginationMeta>(
    `/admin/users${buildAdminQuery({
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
      status: params.status,
      sort: params.sort,
      dir: params.dir,
    })}`,
    ADMIN_NO_STORE,
    undefined,
    await adminCookie(),
  );
}
