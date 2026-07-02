"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { Home, Clapperboard, Ticket, User } from "lucide-react";

const ICON_SIZE = 20;

const navItems = [
  { key: "nav.home",    href: "/",        icon: Home         },
  { key: "nav.movies",  href: "/movies",   icon: Clapperboard },
  { key: "nav.tickets", href: "/tickets",  icon: Ticket       },
  { key: "nav.profile", href: "/profile",  icon: User         },
] as const;

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pt-(--space-xs)"
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
      }}
      aria-label="Main navigation"
    >
      <ul className="flex justify-around items-center">
        {navItems.map(({ key, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center w-full"
                style={{ color: isActive ? "var(--color-gold-light)" : "var(--color-text-muted)" }}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={ICON_SIZE} fill={isActive ? "currentColor" : "none"} />
                <span>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
