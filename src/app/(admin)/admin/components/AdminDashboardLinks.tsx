"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { ADMIN_NAV_GROUPS } from "@/features/admin/adminSections";

/**
 * Launchpad for the console landing. Client-side only because the labels come
 * from `useLocale()` — the dashboard itself stays a server component.
 */
export default function AdminDashboardLinks() {
  const { translate } = useLocale();
  const groups = ADMIN_NAV_GROUPS.filter((group) =>
    group.items.some((item) => item.href !== "/admin"),
  );

  return (
    <section aria-labelledby="admin-quick-actions">
      <h2
        id="admin-quick-actions"
        className="mb-2.5 text-2xs font-bold tracking-[0.18em] text-(--color-text-muted) uppercase"
      >
        {translate("admin.dashboard.quick_actions")}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.labelKey}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-3"
          >
            <p className="px-1 pb-1.5 text-2xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase">
              {translate(group.labelKey)}
            </p>

            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="group flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-[13px] font-semibold text-(--color-text-secondary) no-underline transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text-primary)"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-secondary) transition-colors group-hover:bg-(--color-gold)/15 group-hover:text-(--admin-accent-ink)">
                      <item.Icon size={14} aria-hidden />
                    </span>
                    <span className="flex-1 truncate">{translate(item.labelKey)}</span>
                    <ChevronRight
                      size={14}
                      aria-hidden
                      className="shrink-0 text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
