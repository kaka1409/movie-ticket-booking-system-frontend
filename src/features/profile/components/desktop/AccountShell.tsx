"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import AccountNav from "./AccountNav";

/**
 * Shared chrome for every desktop account page: eyebrow + title (gold-bar h1,
 * matching `MoviesHeader`) + description + action slot, then a two-column body
 * (sticky nav + raised panel). Tablet (740–1023) flattens the nav into a
 * horizontal pill strip above the panel.
 */
export default function AccountShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { translate } = useLocale();

  return (
    <div className="min-w-0">
      <header className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-gold)">
          {translate("profile.area_label")}
        </p>
        <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
              <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 max-w-2xl text-sm text-(--color-text-muted)">{description}</p>
            )}
          </div>
          {action}
        </div>
      </header>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
        <AccountNav />

        <section className="min-w-0 rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
          <div className="surface-raised">{children}</div>
        </section>
      </div>
    </div>
  );
}
