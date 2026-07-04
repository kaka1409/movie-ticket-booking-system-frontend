"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/* ─── MobileSubLayout ────────────────────────────────────────── */
export default function MobileSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLocale();

  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-(--color-border)">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          aria-label={t("sub.back")}
        >
          <ArrowLeft size={22} className="text-(--color-gold-light)" />
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-(--color-gold-light)">
            {t("notif.title")}
          </h1>
          {/*{unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-(--color-gold) text-(--color-bg) text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}*/}
        </div>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          // onClick={markAllRead}
          aria-label={t("notif.mark_all_read")}
        >
          {/*<MoreVertical size={20} className="text-(--color-gold-light)" />*/}
        </button>
      </header>

      {/*<header className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-(--color-border)">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-(--color-gold)" />
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-(--color-gold)">
            {t("notif.title")}
          </h1>
          {unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-(--color-gold) text-(--color-bg) text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          onClick={markAllRead}
          aria-label={t("notif.mark_all_read")}
        >
          <MoreVertical size={20} className="text-(--color-gold-light)" />
        </button>
      </header>*/}

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
