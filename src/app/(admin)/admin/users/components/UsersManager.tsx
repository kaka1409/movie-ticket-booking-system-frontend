"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminPagination from "@/app/(admin)/admin/components/shared/AdminPagination";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import AdminTable, {
  type AdminTableColumn,
} from "@/app/(admin)/admin/components/shared/AdminTable";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { resolveAdminError } from "@/features/admin/errorMessages";
import {
  updateUserRoleAction,
  updateUserStatusAction,
} from "@/features/admin/actions/users.action";
import type {
  AdminPaginationMeta,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/features/admin/types";

interface UsersManagerProps {
  users: AdminUser[];
  pagination: AdminPaginationMeta;
  search: string;
  role: string;
}

export default function UsersManager({ users, pagination, search, role }: UsersManagerProps) {
  const { translate } = useLocale();
  const { token, user: currentUser } = useAuth();
  const { notify } = useToast();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState(search);
  const [roleValue, setRoleValue] = useState(role);
  const [isPending, startTransition] = useTransition();

  const pushUrl = (next: { search?: string; role?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = next.search ?? searchValue;
    const r = next.role ?? roleValue;
    const p = next.page ?? 1;
    if (s) params.set("search", s);
    if (r) params.set("role", r);
    if (p > 1) params.set("page", String(p));
    router.replace(`/admin/users?${params.toString()}`);
  };

  const applySearch = () => pushUrl({ search: searchValue, role: roleValue, page: 1 });

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
    {
      id: "actions",
      className: "w-40",
      align: "right",
      cell: (u) => {
        const isSelf = currentUser?.id === u.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <select
              disabled={isSelf || isPending}
              value={u.role}
              onChange={(e) => {
                if (!token) return;
                startTransition(async () => {
                  const result = await updateUserRoleAction(
                    token,
                    u.id,
                    e.target.value as AdminUserRole,
                  );
                  if (!result.success) {
                    notify(resolveAdminError(result, translate), { variant: "error" });
                    return;
                  }
                  notify(translate("admin.common.saved"), { variant: "success" });
                  router.refresh();
                });
              }}
              className={ADMIN_INPUT_CLASS + " w-24 py-1 text-[11px]"}
            >
              <option value="USER">{translate("admin.users.role_user")}</option>
              <option value="ADMIN">{translate("admin.users.role_admin")}</option>
            </select>
            <AdminButton
              size="sm"
              variant={u.status === "active" ? "danger" : "outline"}
              disabled={isSelf || isPending}
              onClick={() => {
                if (!token) return;
                const next: AdminUserStatus = u.status === "active" ? "banned" : "active";
                startTransition(async () => {
                  const result = await updateUserStatusAction(token, u.id, next);
                  if (!result.success) {
                    notify(resolveAdminError(result, translate), { variant: "error" });
                    return;
                  }
                  notify(translate("admin.common.saved"), { variant: "success" });
                  router.refresh();
                });
              }}
            >
              {u.status === "active"
                ? translate("admin.users.ban")
                : translate("admin.users.unban")}
            </AdminButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <AdminSearchInput
          value={searchValue}
          onChange={setSearchValue}
          className="w-full sm:max-w-xs"
          placeholderKey="admin.users.search"
        />
        <select
          value={roleValue}
          onChange={(e) => setRoleValue(e.target.value)}
          className={ADMIN_INPUT_CLASS + " w-auto"}
        >
          <option value="">{translate("admin.users.all_roles")}</option>
          <option value="USER">{translate("admin.users.role_user")}</option>
          <option value="ADMIN">{translate("admin.users.role_admin")}</option>
        </select>
        <AdminButton variant="outline" size="md" onClick={applySearch}>
          {translate("admin.common.apply")}
        </AdminButton>
        <p className="text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {pagination.total}
        </p>
      </div>

      <AdminTable
        columns={columns}
        rows={users}
        getRowId={(u) => u.id}
        emptyIcon={Users}
        emptyTitleKey="admin.users.empty_title"
        emptyDescriptionKey="admin.users.empty_body"
        captionKey="admin.users.title"
      />

      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        hrefFor={(p) => {
          const params = new URLSearchParams();
          if (search) params.set("search", search);
          if (role) params.set("role", role);
          if (p > 1) params.set("page", String(p));
          return `/admin/users?${params.toString()}`;
        }}
      />
    </>
  );
}
