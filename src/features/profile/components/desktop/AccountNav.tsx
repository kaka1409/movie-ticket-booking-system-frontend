"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import Avatar, { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";
import { ACCOUNT_SECTIONS, accountSectionForPathname } from "@/features/profile/accountSections";

/**
 * Desktop account navigation: identity block + two labelled groups. Tablet
 * (740–1023) flattens it into a horizontal pill strip with no identity block
 * and no group captions, so nothing is hidden behind a scrollbar.
 *
 * The active entry is derived from the current pathname — the sections and
 * their hrefs are already the single source of truth, so a page cannot
 * disagree with the nav about where it is.
 */
export default function AccountNav() {
  const pathname = usePathname();
  const { translate } = useLocale();
  const { user } = useAuth();

  const activeKey = accountSectionForPathname(pathname);

  const groups: Array<"account" | "activity"> = ["account", "activity"];

  return (
    <>
      {/* Tablet strip */}
      <nav
        aria-label={translate("profile.area_label")}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden"
      >
        {ACCOUNT_SECTIONS.map((section) => {
          const isActive = section.key === activeKey;
          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-(--radius-pill) border px-4 py-2 text-xs font-bold transition-colors ${
                isActive
                  ? "border-(--color-gold)/50 bg-(--color-gold)/10 text-(--color-gold)"
                  : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold-light)"
              }`}
            >
              <section.Icon size={14} aria-hidden />
              {translate(section.labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Desktop card */}
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-2">
          {user && (
            <div className="flex items-center gap-3 border-b border-(--color-border) px-2.5 py-3">
              <Avatar
                src={user.avatarUrl}
                fallbackSrc={DEFAULT_AVATAR_SRC}
                name={user.name}
                size="h-10 w-10"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{user.name}</p>
                <p className="truncate text-[11px] text-(--color-text-muted)">{user.email}</p>
              </div>
            </div>
          )}

          <div className="p-1.5">
            {groups.map((group) => (
              <div
                key={group}
                role="group"
                aria-label={translate(`profile.${group}`)}
                className="py-1"
              >
                <p
                  aria-hidden
                  className="px-2.5 pb-1 text-[9px] font-bold tracking-widest text-(--color-text-muted) uppercase"
                >
                  {translate(`profile.${group}`)}
                </p>
                {ACCOUNT_SECTIONS.filter((section) => section.group === group).map((section) => {
                  const isActive = section.key === activeKey;
                  return (
                    <Link
                      key={section.href}
                      href={section.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-semibold no-underline transition-colors duration-150 ${
                        isActive
                          ? "bg-(--color-surface-2) text-(--color-gold)"
                          : "text-(--color-text-secondary) hover:bg-(--color-surface-2) hover:text-(--color-gold-light)"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
                          isActive
                            ? "bg-(--color-gold)/15 text-(--color-gold)"
                            : "bg-(--color-surface-2) text-(--color-text-secondary) group-hover:bg-(--color-gold)/15 group-hover:text-(--color-gold)"
                        }`}
                      >
                        <section.Icon size={14} aria-hidden />
                      </span>
                      <span className="flex-1">{translate(section.labelKey)}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
