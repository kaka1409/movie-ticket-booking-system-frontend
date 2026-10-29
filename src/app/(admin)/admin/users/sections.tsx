import AdminDataError from "@/features/admin/components/AdminDataError";
import { getAdminUsers } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import type { AdminUserRole } from "@/features/admin/types";
import UsersManager from "./components/UsersManager";

export interface AdminUsersQuery {
  search: string;
  role: string;
  page: number;
}

export async function UsersManagerSection({ search, role, page }: AdminUsersQuery) {
  const validRole = role === "USER" || role === "ADMIN" ? role : "";
  const result = await getAdminUsers({
    page,
    limit: 10,
    search,
    role: validRole as AdminUserRole,
  });
  if (isUnauthorizedResult(result)) return null;
  if ("error" in result) return <AdminDataError message={result.error.message} />;
  return (
    <UsersManager
      users={result.data.users}
      pagination={result.meta!}
      search={search}
      role={validRole}
    />
  );
}
