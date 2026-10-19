"use client";

import { useLocale } from "@/contexts/LocaleContext";
import PasswordChecklist from "@/components/ui/PasswordChecklist";

/**
 * Change-password card around the shared rule checklist: the card chrome and
 * title are this page's, the rules and their live state come from
 * `PasswordChecklist` (which reads `PASSWORD_RULES`, the same source the schema
 * validates with).
 */
export default function PasswordRequirements({ password }: { password: string }) {
  const { translate } = useLocale();

  return (
    <div className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <h2 className="mb-3 text-lg font-bold text-(--color-text-primary)">
        {translate("profile.password.requirements")}
      </h2>
      <PasswordChecklist password={password} />
    </div>
  );
}
