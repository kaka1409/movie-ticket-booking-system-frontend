"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import Badge from "@/components/ui/Badge";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";
import { resolveAdminError } from "@/features/admin/errorMessages";
import {
  updateUserRoleAction,
  updateUserStatusAction,
} from "@/features/admin/actions/users.action";
import { formatCalendarDate } from "@/libs/date";
import type {
  AdminActionResult,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/features/admin/types";

/**
 * The expanded-row panel for one account: read-only facts plus the two writes
 * the console owns (role, ban status) and a shortcut into that member's review
 * history on the reviews console.
 */
export default function UserInlineEdit({ user }: { user: AdminUser }) {
  const { translate, locale } = useLocale();
  const { token, user: currentUser } = useAuth();
  const { notify } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isSelf = currentUser?.id === user.id;

  const runMutation = (action: () => Promise<AdminActionResult<unknown>>) => {
    if (!token) return;
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        notify(resolveAdminError(result, translate), { variant: "error" });
        return;
      }
      notify(translate("admin.common.saved"), { variant: "success" });
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <dl className="grid gap-3 text-[12px] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.users.column_user")}
          </dt>
          <dd className="mt-1 text-(--color-text-primary)">{user.fullname}</dd>
          <dd className="text-(--color-text-muted)">{user.email}</dd>
          {user.phone && <dd className="text-(--color-text-muted)">{user.phone}</dd>}
        </div>
        <div>
          <dt className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.users.column_created")}
          </dt>
          <dd className="mt-1 tabular-nums text-(--color-text-primary)">
            {formatCalendarDate(user.createdAt.slice(0, 10), locale)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.users.column_bookings")}
          </dt>
          <dd className="mt-1 tabular-nums text-(--color-text-primary)">{user.bookingCount}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold tracking-[0.14em] text-(--color-text-muted) uppercase">
            {translate("admin.users.column_status")}
          </dt>
          <dd className="mt-1">
            <Badge variant={user.status === "active" ? "success" : "error"} size="xs">
              {translate(
                user.status === "active"
                  ? "admin.users.status_active"
                  : "admin.users.status_banned",
              )}
            </Badge>
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-2 border-t border-(--color-border) pt-3">
        <select
          disabled={isSelf || isPending}
          value={user.role}
          onChange={(event) =>
            runMutation(() =>
              updateUserRoleAction(token ?? "", user.id, event.target.value as AdminUserRole),
            )
          }
          className={`${ADMIN_INPUT_CLASS} w-32 py-1.5 text-[12px]`}
          aria-label={translate("admin.users.change_role")}
        >
          <option value="USER">{translate("admin.users.role_user")}</option>
          <option value="ADMIN">{translate("admin.users.role_admin")}</option>
        </select>

        <AdminButton
          size="sm"
          variant={user.status === "active" ? "danger" : "outline"}
          disabled={isSelf || isPending}
          onClick={() => {
            const next: AdminUserStatus = user.status === "active" ? "banned" : "active";
            runMutation(() => updateUserStatusAction(token ?? "", user.id, next));
          }}
        >
          {user.status === "active" ? translate("admin.users.ban") : translate("admin.users.unban")}
        </AdminButton>

        <Link
          href={`/admin/reviews?userId=${user.id}`}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-(--color-gold) transition-colors hover:bg-(--color-surface-2)"
        >
          <MessageSquare size={13} aria-hidden />
          {translate("admin.users.view_reviews")}
        </Link>
      </div>
    </div>
  );
}
