"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Badge from "@/components/ui/Badge";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import type { AdminPaginationMeta, AdminUser } from "@/features/admin/types";
import UserInlineEdit from "./UserInlineEdit";
import UsersFiltersCard, { type UserFilterDraft } from "./UsersFiltersCard";

interface UsersManagerProps {
  users: AdminUser[];
  pagination: AdminPaginationMeta;
  search: string;
  role: string;
  status: string;
}

/**
 * Account table plus its expandable-row editor. The backend paginates this
 * list, so the page number and filters live in the URL (`AdminPagination` in
 * link mode). The toolbar edits stay local until Apply — one navigation per
 * commit, like `MoviesManager`.
 */
export default function UsersManager({
  users,
  pagination,
  search,
  role,
  status,
}: UsersManagerProps) {
  const { translate } = useLocale();
  const router = useRouter();
  const [isNavigating, startNavigation] = useTransition();

  /** Filters as committed in the URL — tab links and pagination build on these. */
  const appliedFilters: UserFilterDraft = { search, role, status };

  const buildHref = (filters: UserFilterDraft, page = 1) => {
    const params = new URLSearchParams();

    if (filters.search !== "") params.set("search", filters.search);
    if (filters.role !== "") params.set("role", filters.role);
    if (filters.status !== "") params.set("status", filters.status);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    return query === "" ? "/admin/users" : `/admin/users?${query}`;
  };

  const navigate = (href: string) => startNavigation(() => router.push(href));

  const columns: AdminTableColumn<AdminUser>[] = [
    {
      id: "user",
      headerKey: "admin.users.column_user",
      cell: (u) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-(--color-text-primary)">{u.fullname}</p>
          <p className="truncate text-[11px] text-(--color-text-muted)">{u.email}</p>
          {u.phone && <p className="truncate text-[11px] text-(--color-text-muted)">{u.phone}</p>}
        </div>
      ),
    },
    {
      id: "role",
      headerKey: "admin.users.column_role",
      className: "w-28",
      cell: (u) => (
        <Badge variant={u.role === "ADMIN" ? "gold" : "neutral"} size="xs">
          {translate(u.role === "ADMIN" ? "admin.users.role_admin" : "admin.users.role_user")}
        </Badge>
      ),
    },
    {
      id: "status",
      headerKey: "admin.users.column_status",
      className: "w-28",
      cell: (u) => (
        <Badge variant={u.status === "active" ? "success" : "error"} size="xs">
          {translate(
            u.status === "active" ? "admin.users.status_active" : "admin.users.status_banned",
          )}
        </Badge>
      ),
    },
    {
      id: "bookings",
      headerKey: "admin.users.column_bookings",
      className: "w-24",
      align: "right",
      cell: (u) => <span className="tabular-nums">{u.bookingCount}</span>,
    },
    {
      id: "created",
      headerKey: "admin.users.column_created",
      className: "w-32",
      cell: (u) => (
        <span className="text-[11px]">{new Date(u.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  const isFiltered = Object.values(appliedFilters).some((value) => value !== "");

  return (
    <>
      <UsersFiltersCard
        search={search}
        role={role}
        status={status}
        total={pagination.total}
        isFiltered={isFiltered}
        onApply={(draft) => navigate(buildHref({ ...appliedFilters, ...draft }))}
        onClear={() => navigate("/admin/users")}
      />

      <div className={isNavigating ? "pointer-events-none opacity-60 transition-opacity" : ""}>
        <AdminTable
          columns={columns}
          rows={users}
          getRowId={(u) => u.id}
          emptyIcon={Users}
          emptyTitleKey={isFiltered ? "admin.common.no_results" : "admin.users.empty_title"}
          emptyDescriptionKey={
            isFiltered ? "admin.common.no_results_body" : "admin.users.empty_body"
          }
          captionKey="admin.users.title"
          renderExpanded={(user) => <UserInlineEdit key={user.id} user={user} />}
        />

        <AdminPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hrefFor={(p) => buildHref(appliedFilters, p)}
        />
      </div>
    </>
  );
}
