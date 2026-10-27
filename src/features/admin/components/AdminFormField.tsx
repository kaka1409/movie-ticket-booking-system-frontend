"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_LABEL_CLASS } from "../constants";

/**
 * Labelled console form row. The control is nested inside the `<label>`, so no
 * `id`/`htmlFor` pair has to be threaded through the page — a wrapper is also
 * what lets the error message sit under the field it belongs to.
 */
export default function AdminFormField({
  labelKey,
  hintKey,
  error,
  className = "",
  children,
}: {
  labelKey: string;
  hintKey?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const { translate } = useLocale();

  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={ADMIN_LABEL_CLASS}>{translate(labelKey)}</span>
      {children}
      {hintKey && !error && (
        <span className="text-[11px] leading-snug text-(--color-text-muted)">
          {translate(hintKey)}
        </span>
      )}
      {error && (
        <span role="alert" className="text-[11px] font-semibold text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}

/** Boolean row — the label sits beside the box, not above it. */
export function AdminCheckbox({
  labelKey,
  hintKey,
  checked,
  onChange,
  disabled = false,
}: {
  labelKey: string;
  hintKey?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const { translate } = useLocale();

  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-(--color-gold)"
      />
      <span className="min-w-0">
        <span className="block text-[12px] font-bold text-(--color-text-primary)">
          {translate(labelKey)}
        </span>
        {hintKey && (
          <span className="mt-0.5 block text-[11px] leading-snug text-(--color-text-muted)">
            {translate(hintKey)}
          </span>
        )}
      </span>
    </label>
  );
}
