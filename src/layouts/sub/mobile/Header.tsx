"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { getSubTitle } from "../utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { translate } = useLocale();
  const title = getSubTitle(pathname, translate);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-(--color-border)">
      <button
        onClick={() => router.back()}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
        aria-label={translate("layout.sub.back")}
      >
        <ArrowLeft size={22} className="text-(--color-gold-light)" />
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-(--color-gold-light)">
          {title}
        </h1>
      </div>

      <div className="w-9 h-9" />
    </header>
  );
}
