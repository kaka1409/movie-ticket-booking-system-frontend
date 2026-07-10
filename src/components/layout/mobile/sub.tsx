"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { ALL_MOVIES } from "@/features/movies/mock";

function getSubTitle(pathname: string, t: (key: string) => string): string {
  if (pathname.startsWith("/notifications")) return t("notif.title");
  if (pathname.startsWith("/tickets")) return "Ticket Details";
  if (pathname.startsWith("/movies/")) {
    const slug = pathname.split("/movies/")[1];
    const movie = ALL_MOVIES.find((m) => m.slug === slug);
    return movie?.title ?? "";
  }
  return "";
}

export default function MobileSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const title = getSubTitle(pathname, t);

  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between px-4 py-2 border-b border-(--color-border)">
        <Link
          href={pathname.startsWith("/tickets") ? "/tickets" : "/"}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-(--color-gold-light)" />
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-(--color-gold-light)">
            {title}
          </h1>
        </div>

        <div className="w-9 h-9" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
