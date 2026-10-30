"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Header band every console page shares: eyebrow, gold-bar title, optional
 * description and an action slot (usually the "New …" button).
 *
 * It takes i18n KEYS rather than translated strings so a server page can mount
 * it without owning a translator — `useLocale()` is a client context.
 */
export default function AdminPageHeader({
  eyebrowKey,
  titleKey,
  descriptionKey,
  actions,
}: {
  eyebrowKey?: string;
  titleKey: string;
  descriptionKey?: string;
  actions?: ReactNode;
}) {
  const { translate } = useLocale();

  return (
    <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrowKey && (
          <p className="text-2xs font-bold tracking-[0.18em] text-(--color-text-muted) uppercase">
            {translate(eyebrowKey)}
          </p>
        )}

        <h1 className="mt-1.5 flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-(--color-text-primary) md:text-2xl">
          <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-(--color-gold)" />
          <span className="truncate">{translate(titleKey)}</span>
        </h1>

        {descriptionKey && (
          <p className="mt-2 max-w-2xl text-[13px] text-(--color-text-muted)">
            {translate(descriptionKey)}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
