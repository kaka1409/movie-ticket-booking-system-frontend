"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { PRESS_CLASS } from "@/libs/press";
import { ACCOUNT_SECTIONS, accountSectionForPathname } from "@/features/profile/constants";

/**
 * Desktop account horizontal navigation tabs:
 * Renders an accessible navigation landmark with active page state indicators,
 * icon badges, and smooth hover animations.
 */
export default function AccountTabs() {
  const pathname = usePathname();
  const { translate } = useLocale();
  const activeKey = accountSectionForPathname(pathname);

  return (
    <nav
      aria-label={translate("profile.area_label")}
      className="mt-4 flex gap-1 overflow-x-auto border-b border-(--color-border) scrollbar-hide"
    >
      {ACCOUNT_SECTIONS.map((section) => {
        const isActive = section.key === activeKey;
        const Icon = section.Icon;

        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={isActive ? "page" : undefined}
            className={`
              relative flex shrink-0 items-center gap-1.5 p-4 text-sm font-bold rounded-(--radius-sm) tracking-wide transition hover:bg-(--color-surface-2) hover:text-(--color-gold-light)
              ${PRESS_CLASS}
              ${isActive ? "text-(--color-gold) " : "text-(--color-text-muted)"}
            `}
          >
            <Icon
              size={16}
              className={isActive ? "text-(--color-gold)" : "text-current"}
              aria-hidden
            />
            <span>{translate(section.labelKey)}</span>

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
