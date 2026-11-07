"use client";

import { useLocale } from "@/contexts/LocaleContext";
import Chip from "@/components/ui/Chip";
import { ADMIN_LABEL_CLASS } from "@/features/admin/constants";

export interface AdminFilterOption {
  value: string;
  labelKey?: string;
  label?: string;
}

/**
 * One labelled chip group inside an admin filter card — the "All" chip clears
 * the value, picking an option selects it, picking it again clears. Mirrors the
 * chip rows of `MovieFiltersCard` so every console table filters the same way.
 */
export default function AdminFilterChipGroup({
  labelKey,
  allLabelKey = "admin.common.all",
  options,
  value,
  onChange,
  className = "",
}: {
  labelKey: string;
  allLabelKey?: string;
  options: AdminFilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const { translate } = useLocale();

  return (
    <div className={className}>
      <span className={ADMIN_LABEL_CLASS}>{translate(labelKey)}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <Chip
          label={translate(allLabelKey)}
          active={value === ""}
          onClick={() => onChange("")}
          variant="selectable"
        />
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.labelKey ? translate(option.labelKey) : (option.label ?? option.value)}
            active={value === option.value}
            onClick={() => onChange(value === option.value ? "" : option.value)}
            variant="selectable"
          />
        ))}
      </div>
    </div>
  );
}
