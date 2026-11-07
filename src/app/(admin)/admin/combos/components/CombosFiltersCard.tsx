"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AdminButton from "@/app/(admin)/admin/components/shared/AdminButton";
import AdminFilterChipGroup from "@/app/(admin)/admin/components/shared/AdminFilterChips";
import AdminSearchInput from "@/app/(admin)/admin/components/shared/AdminSearchInput";
import { ADMIN_CARD_CLASS } from "@/features/admin/constants";

/** Draft the card hands to `onApply` — committed filter state, not URL params. */
export interface ComboFilterDraft {
  search: string;
  isActive: string;
  tag: string;
}

/**
 * Compact filter card above the combo table, same shape as
 * `MovieFiltersCard`: search + create on top, chip groups below, Apply/Clear
 * footer. Edits stay local until Apply.
 */
export default function CombosFiltersCard({
  tags,
  search,
  isActive,
  tag,
  isFiltered,
  onApply,
  onClear,
  onCreate,
}: {
  /** Distinct tag values present in the loaded rows. */
  tags: string[];
  search: string;
  isActive: string;
  tag: string;
  isFiltered: boolean;
  onApply: (draft: ComboFilterDraft) => void;
  onClear: () => void;
  onCreate: () => void;
}) {
  const { translate } = useLocale();

  const [searchInput, setSearchInput] = useState(search);
  const [isActiveValue, setIsActiveValue] = useState(isActive);
  const [tagValue, setTagValue] = useState(tag);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApply({ search: searchInput, isActive: isActiveValue, tag: tagValue });
  };

  const handleClear = () => {
    setSearchInput("");
    setIsActiveValue("");
    setTagValue("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`${ADMIN_CARD_CLASS} mb-3 p-3`}>
      <div className="flex items-center gap-2">
        <AdminSearchInput
          value={searchInput}
          onChange={setSearchInput}
          className="min-w-0 flex-1"
          placeholderKey="admin.combos.search"
        />
        <AdminButton icon={Plus} variant="primary" size="md" onClick={onCreate}>
          {translate("admin.combos.new")}
        </AdminButton>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-(--color-border) pt-3 sm:grid-cols-3">
        <AdminFilterChipGroup
          labelKey="admin.combos.column_status"
          options={[
            { value: "true", labelKey: "admin.common.active" },
            { value: "false", labelKey: "admin.common.inactive" },
          ]}
          value={isActiveValue}
          onChange={setIsActiveValue}
        />

        {tags.length > 0 && (
          <AdminFilterChipGroup
            labelKey="admin.combos.tag"
            options={tags.map((entry) => ({ value: entry, label: entry }))}
            value={tagValue}
            onChange={setTagValue}
            className="col-span-2 sm:col-span-1"
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-(--color-border) pt-3">
        <AdminButton type="submit" variant="outline" size="md">
          {translate("admin.common.apply")}
        </AdminButton>
        {isFiltered && (
          <AdminButton onClick={handleClear}>{translate("admin.common.clear_filters")}</AdminButton>
        )}
      </div>
    </form>
  );
}
