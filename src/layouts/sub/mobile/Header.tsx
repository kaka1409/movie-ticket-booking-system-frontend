"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSubTitle, getBackHref } from "../utils";

export default function Header() {
  const pathname = usePathname();
  const { translate } = useLocale();
  const title = getSubTitle(pathname, translate);
  const backHref = getBackHref(pathname);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-(--color-border)">
      <Link
        href={backHref}
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
  );
}
