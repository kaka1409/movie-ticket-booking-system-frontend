"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Logo from "@/layouts/components/Logo";
import LanguageToggle from "@/layouts/components/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";
import { getNotifications } from "@/features/notifications/api";

export default function Header() {
  const { translate } = useLocale();
  const [unreadCount, setUnreadCount] = useState(0);

  /* The badge loads after hydration so the main layout can stay cookie-free
     (a server-side fetch there would force `/` and `/home` dynamic). */
  useEffect(() => {
    let cancelled = false;
    async function loadUnreadCount() {
      try {
        const items = await getNotifications();
        if (!cancelled) setUnreadCount(items.filter((item) => !item.read).length);
      } catch {
        // The badge is decorative — leave it at 0 when the fetch fails
      }
    }
    loadUnreadCount();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky bg-(--color-bg) top-0 z-40 w-full">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          <LanguageToggle variant="flag" />

          <Link
            href="/notifications"
            className="relative text-(--color-gold-light)"
            aria-label={translate("layout.header.notifications")}
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
