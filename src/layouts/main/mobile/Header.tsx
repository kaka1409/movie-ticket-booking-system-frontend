"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/components/layout/Logo";
import LanguageToggle from "@/components/layout/LanguageToggle";

export default function Header({ unreadCount }: { unreadCount: number }) {
  return (
    <header className="sticky bg-(--color-bg) top-0 z-40 w-full">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          <LanguageToggle variant="flag" />

          <Link
            href="/notifications"
            className="relative text-(--color-gold-light)"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] flex items-center justify-center rounded-full bg-red-500 text-white text-[8px] font-bold">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
