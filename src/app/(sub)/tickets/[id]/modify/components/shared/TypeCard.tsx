"use client";

import { useLocale } from "@/contexts/LocaleContext";
import type { ModificationType } from "@/features/tickets/types";
import type { ModifyTypeOption } from "./type-options";

/**
 * One selectable change type. The radio dot is decorative markup rather than a
 * real input: the whole row is the button, and a hidden control would only add a
 * second focusable stop for the same choice.
 */
export default function TypeCard({
  option,
  isSelected,
  onSelect,
}: {
  option: ModifyTypeOption;
  isSelected: boolean;
  onSelect: (type: ModificationType) => void;
}) {
  const { translate } = useLocale();
  const { type, icon: Icon, labelKey, descKey } = option;

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      aria-pressed={isSelected}
      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition duration-150 active:scale-[0.99] ${
        isSelected
          ? "border-(--color-gold) bg-(--color-surface) shadow-[0_0_0_1px_rgba(255,204,77,0.12)]"
          : "border-(--color-border) bg-(--color-surface) hover:border-(--color-gold)/30"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          isSelected
            ? "bg-(--color-gold)/10 text-(--color-gold)"
            : "bg-(--color-surface-2) text-(--color-text-muted)"
        }`}
      >
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold ${
            isSelected ? "text-(--color-text-primary)" : "text-(--color-text-secondary)"
          }`}
        >
          {translate(labelKey)}
        </p>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">{translate(descKey)}</p>
      </div>

      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition duration-150 ${
          isSelected ? "border-(--color-gold) bg-(--color-gold)" : "border-(--color-text-muted)"
        }`}
      >
        {isSelected && <div className="h-2 w-2 rounded-full bg-(--color-bg)" />}
      </div>
    </button>
  );
}
