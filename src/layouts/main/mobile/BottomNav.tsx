"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { NAV_ITEMS, ICON_SIZE } from "../types";

export default function BottomNav() {
  const pathname = usePathname();
  const { translate } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-(--color-surface) border-t border-(--color-border)"
      aria-label="Main navigation"
    >
      <ul className="flex justify-around items-center">
        {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center min-w-15"
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex flex-col gap-0.5 items-center w-full py-1.5 text-xs ${
                    isActive
                      ? "text-(--color-gold-light) bg-(--color-gold-light)/20 rounded-(--radius-md)"
                      : "text-(--color-text-muted)"
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
