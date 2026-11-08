"use client";

import type { ReactNode } from "react";
import AccountHero from "./AccountHero";
import AccountTabs from "./AccountTabs";
import DesktopPageHeader from "@/components/shared/DesktopPageHeader";

/**
 * Shared desktop chrome for all account pages: the member hero, the horizontal
 * account nav, then the page band (the same `DesktopPageHeader` /movies and the
 * ticket list use) and the content area.
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
  return (
    <div className="min-w-0">
      <AccountHero />

      <AccountTabs />

      <div className="mt-8 min-w-0">
        <DesktopPageHeader className="mb-6" title={title} subtitle={description} action={action} />
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)">
          {children}
        </div>
      </div>
    </div>
  );
}
