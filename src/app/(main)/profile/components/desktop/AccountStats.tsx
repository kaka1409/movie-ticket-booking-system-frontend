"use client";

import Link from "next/link";
import { Heart, Star, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { ReactNode } from "react";

const TILES: Array<{
  key: "tickets" | "reviews" | "wishlist";
  href: string;
  Icon: typeof Ticket;
  labelKey: string;
}> = [
  { key: "tickets", href: "/tickets", Icon: Ticket, labelKey: "profile.stats.tickets" },
  { key: "reviews", href: "/profile/reviews", Icon: Star, labelKey: "profile.stats.reviews" },
  { key: "wishlist", href: "/profile/wishlist", Icon: Heart, labelKey: "profile.stats.wishlist" },
];

/**
 * Compact activity counters for member stats: tickets, reviews, and wishlist
 * items as a divided row inside the overview panel.
 */
export default function AccountStats({
  stats,
}: {
  stats: { reviews: ReactNode; wishlist: ReactNode; tickets: ReactNode };
}) {
  const { translate } = useLocale();

  return (
    <div className="grid grid-cols-3 divide-x divide-(--color-border)/50">
      {TILES.map(({ key, href, Icon, labelKey }) => (
        <Link
          key={key}
          href={href}
          className="group flex min-w-0 items-center gap-3 px-3 py-1 transition hover:opacity-80 sm:gap-4 sm:px-5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-2) text-(--color-gold) transition-colors group-hover:bg-(--color-gold)/15">
            <Icon size={17} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-2xl leading-7 font-black tracking-tight text-white">
              {stats[key]}
            </div>
            <p className="truncate text-2xs font-bold tracking-wider text-(--color-text-muted) uppercase">
              {translate(labelKey)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
