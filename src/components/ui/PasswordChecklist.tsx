"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { PASSWORD_RULES } from "@/libs/validation";

const SIZE_CLASSES = {
  sm: { gap: "gap-1.5", icon: "h-4 w-4", label: "text-xs" },
  md: { gap: "gap-2", icon: "h-5 w-5", label: "text-sm" },
} as const;

/**
 * Live "your password needs…" checklist: every rule from `libs/validation.ts` — the
 * same source the register/change-password schemas validate with — ticked off
 * as the value satisfies it.
 *
 * Renders the bare list; the caller owns any card, title or spacing around it.
 */
export default function PasswordChecklist({
  password,
  size = "md",
  className = "",
}: {
  password: string;
  /** `sm` tightens the rows for a card that is already tall (desktop register). */
  size?: "sm" | "md";
  className?: string;
}) {
  const { translate } = useLocale();
  const { gap, icon, label } = SIZE_CLASSES[size];

  return (
    <ul className={`flex flex-col ${gap} ${className}`}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);

        return (
          <li key={rule.labelKey} className="flex items-center gap-2">
            {met ? (
              <CheckCircle2 className={`${icon} shrink-0 text-(--color-gold)`} />
            ) : (
              <Circle className={`${icon} shrink-0 text-(--color-text-muted)`} />
            )}
            <span
              className={`${label} ${met ? "text-(--color-text-primary)" : "text-(--color-text-muted)"}`}
            >
              {translate(rule.labelKey)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
