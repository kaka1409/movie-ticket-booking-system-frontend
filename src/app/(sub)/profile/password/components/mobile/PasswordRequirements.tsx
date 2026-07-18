"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  const { translate } = useLocale();

  const REQUIREMENTS: { label: string; test: (value: string) => boolean }[] = [
    { label: translate("profile.password.req_length"), test: (v) => v.length >= 8 },
    { label: translate("profile.password.req_uppercase"), test: (v) => /[A-Z]/.test(v) },
    { label: translate("profile.password.req_number"), test: (v) => /[0-9]/.test(v) },
    { label: translate("profile.password.req_special"), test: (v) => /[!@#$%^&*]/.test(v) },
  ];
  return (
    <div className="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
      <h2 className="mb-3 text-lg font-bold text-(--color-text-primary)">
        {translate("profile.password.requirements")}
      </h2>
      <ul className="flex flex-col gap-2">
        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li key={req.label} className="flex items-center gap-2">
              {met ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-(--color-gold)" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-(--color-text-muted)" />
              )}
              <span
                className={
                  met
                    ? "text-sm text-(--color-text-primary)"
                    : "text-sm text-(--color-text-muted)"
                }
              >
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
