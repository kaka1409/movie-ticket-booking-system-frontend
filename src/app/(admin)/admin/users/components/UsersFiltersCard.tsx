"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";

/** Draft the card hands to `onApply` — wire param names for the URL commit. */
export interface UserFilterDraft {
  search: string;
  role: string;
  status: string;
}

/**
 * Compact filter card above the user table, same shape as `MovieFiltersCard`:
 * search on top, chip groups below, Apply/Clear footer. Edits stay local until
 * Apply — one URL navigation per commit.
 */
export default function UsersFiltersCard({
  search,
  role,
  status,
  total,
  isFiltered,
  onApply,
  onClear,
}: {
  search: string;
  role: string;
  status: string;
  total: number;
  isFiltered: boolean;
  onApply: (draft: UserFilterDraft) => void;
  onClear: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(search);
  const [roleValue, setRoleValue] = useState(role);
  const [statusValue, setStatusValue] = useState(status);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({ search: searchInput, role: roleValue, status: statusValue });
  };

  const handleClear = () => {
    setSearchInput("");
    setRoleValue("");
    setStatusValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <AdminSearchInput
        value={searchInput}
        onChange={setSearchInput}
        placeholderKey="admin.users.search"
      />

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.users.column_role"
          options={[
            { value: "USER", labelKey: "admin.users.role_user" },
            { value: "ADMIN", labelKey: "admin.users.role_admin" },
          ]}
          value={roleValue}
          onChange={setRoleValue}
        />

        <AdminFilterChipGroup
          labelKey="admin.users.column_status"
          options={[
            { value: "active", labelKey: "admin.users.status_active" },
            { value: "banned", labelKey: "admin.users.status_banned" },
          ]}
          value={statusValue}
          onChange={setStatusValue}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="primary" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
        <p className="ml-auto text-[11px] font-semibold text-(--color-text-muted)">
          {translate("admin.common.total")}: {total}
        </p>
      </div>
    </form>
  );
}
