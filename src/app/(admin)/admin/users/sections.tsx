import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import { getAdminUsers } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminUserRole, AdminUserStatus } from "@/features/admin/types";
import UsersManager from "./components/UsersManager";

export interface AdminUsersQuery {
  search: string;
  role: string;
  status: string;
  sort: string;
  dir: string;
  page: number;
}

export async function UsersManagerSection({
  search,
  role,
  status,
  sort,
  dir,
  page,
}: AdminUsersQuery) {
  const validRole = role === "USER" || role === "ADMIN" ? role : "";
  const validStatus = status === "active" || status === "banned" ? status : "";
  const result = await getAdminUsers({
    page,
    limit: 10,
    search,
    role: validRole as AdminUserRole,
    status: validStatus as AdminUserStatus,
    sort,
    dir: dir === "asc" ? "asc" : "desc",
  });
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return (
    <UsersManager
      users={result.data.users}
      pagination={result.meta!}
      search={search}
      role={validRole}
      status={validStatus}
      sort={sort}
      dir={dir}
    />
  );
}
