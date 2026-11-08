"use client";

import { Search, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_INPUT_CLASS } from "@/features/admin/constants";

/** Search box for the console toolbars (in-memory filters on every list page). */
export default function AdminSearchInput({
  value,
  onChange,
  placeholderKey = "admin.common.search",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholderKey?: string;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <div className={`relative ${className}`}>
      <Search
        size={14}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--color-text-muted)"
      />
      <input
        type="search"
        name="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={translate(placeholderKey)}
        aria-label={translate(placeholderKey)}
        className={`${ADMIN_INPUT_CLASS} pr-9 pl-8`}
      />
      {value !== "" && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={translate("admin.common.clear_search")}
          className="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-(--color-text-muted) transition-colors hover:bg-(--color-surface) hover:text-(--color-text-primary)"
        >
          <X size={13} aria-hidden />
        </button>
      )}
    </div>
  );
}
