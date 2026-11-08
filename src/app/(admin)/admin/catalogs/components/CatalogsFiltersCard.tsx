"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";

/** Draft the card hands to `onApply` — committed filter state, not URL params. */
export interface CatalogFilterDraft {
  search: string;
  isActive: string;
}

/**
 * Compact filter card above the catalog table, same shape as
 * `MovieFiltersCard`: search + create on top, chip groups below, Apply/Clear
 * footer. Edits stay local until Apply — one state commit per apply.
 */
export default function CatalogsFiltersCard({
  search,
  isActive,
  isFiltered,
  onApply,
  onClear,
  onCreate,
  createLabelKey,
  searchPlaceholderKey,
}: {
  search: string;
  isActive: string;
  isFiltered: boolean;
  onApply: (draft: CatalogFilterDraft) => void;
  onClear: () => void;
  onCreate: () => void;
  createLabelKey: string;
  searchPlaceholderKey: string;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(search);
  const [isActiveValue, setIsActiveValue] = useState(isActive);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({ search: searchInput, isActive: isActiveValue });
  };

  const handleClear = () => {
    setSearchInput("");
    setIsActiveValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <div className="flex items-center gap-2">
        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          className="min-w-0 flex-1"
          placeholderKey={searchPlaceholderKey}
        />
        <AdminButton icon={Plus} variant="primary" size="md" onClick={onCreate}>
          {translate(createLabelKey)}
        </AdminButton>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.common.status"
          options={[
            { value: "true", labelKey: "admin.catalogs.active" },
            { value: "false", labelKey: "admin.catalogs.hidden" },
          ]}
          value={isActiveValue}
          onChange={setIsActiveValue}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="primary" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
      </div>
    </form>
  );
}
