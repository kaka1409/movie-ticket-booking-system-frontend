"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { NAV_ITEMS, ICON_SIZE } from "../types";
import { PRESS_CLASS } from "@/libs/press";

export default function BottomNav() {
  const pathname = usePathname();
  const { translate } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-nav print:hidden max-w-md mx-auto bg-(--color-surface) border-t border-(--color-border)"
      aria-label={translate("layout.nav.main")}
    >
      <ul className="flex justify-around items-center">
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex min-w-15 flex-col items-center ${PRESS_CLASS}`}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex w-full flex-col items-center gap-0.5 py-1.5 text-xs ${
                    isActive
                      ? "rounded-(--radius-md) bg-(--color-gold-light)/20 text-(--color-gold-light)"
                      : "text-(--color-text-muted) hover:text-(--color-gold-light)"
                  }`}
                >
                  <Icon size={ICON_SIZE} />
                  <span>{translate(key)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
