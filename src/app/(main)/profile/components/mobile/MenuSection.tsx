"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface MenuItem {
  labelKey: string;
  Icon: React.ElementType;
  href: string;
}

export default function MenuSection({
  labelKey,
  items,
}: {
  labelKey: string;
  items: MenuItem[];
}) {
  const { translate } = useLocale();

  return (
    <div className="px-4">
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2 ml-1 text-(--color-text-muted)">
        {translate(labelKey)}
      </p>

      <div className="rounded-2xl overflow-hidden bg-(--color-surface) border border-(--color-border)">
        {items.map(({ labelKey: itemLabelKey, Icon, href }, idx) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-4 px-4 py-4 transition-colors group hover:bg-(--color-surface-2) ${
              idx > 0 ? "border-t border-(--color-border)" : ""
            }`}
          >
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-(--color-surface-2) text-(--color-text-secondary)">
              <Icon size={18} />
            </span>

            <span className="flex-1 font-semibold text-sm text-(--color-text-primary)">
              {translate(itemLabelKey)}
            </span>

            <ChevronRight
              size={16}
              className="text-(--color-text-muted) transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
