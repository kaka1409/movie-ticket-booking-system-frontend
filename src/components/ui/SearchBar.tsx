"use client";

import { Search, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { PRESS_CLASS } from "@/libs/press";

export default function SearchBar({
  value,
  onChange,
  onFocus,
  placeholder,
  showClearButton = true,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  showClearButton?: boolean;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-(--color-surface) border border-(--color-border) px-4 py-3 transition-colors focus-within:border-(--color-gold)/50 ${className}`}
    >
      <Search size={16} className="shrink-0 text-(--color-text-muted)" />
      <input
        type="search"
        name="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        className="
          flex-1 bg-transparent text-sm text-(--color-text-primary) outline-none 
          placeholder:text-(--color-text-muted) [&::-webkit-search-cancel-button]:appearance-none
        "
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={translate("common.clear_search")}
          className={`shrink-0 text-(--color-text-muted) hover:text-(--color-text-primary) ${PRESS_CLASS}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
