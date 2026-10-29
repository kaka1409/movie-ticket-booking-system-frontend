"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, Star, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

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
 * Interactive summary metric cards for member activity:
 * Tickets, reviews, and wishlist items with responsive hover elevations.
 */
export default function AccountStats({
  stats,
}: {
  stats: { reviews: number | null; wishlist: number | null; tickets: number | null };
}) {
  const { translate } = useLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TILES.map(({ key, href, Icon, labelKey }) => (
        <Link
          key={key}
          href={href}
          className="group relative overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 transition duration-200 hover:-translate-y-0.5 hover:border-(--color-gold)/50 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-surface-2) text-(--color-gold) transition-colors group-hover:bg-(--color-gold)/15">
              <Icon size={19} />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-surface-2)/60 text-(--color-text-muted) transition duration-200 group-hover:bg-(--color-gold)/20 group-hover:text-(--color-gold)">
              <ArrowUpRight size={15} />
            </span>
          </div>

          <p className="mt-4 text-3xl font-black tracking-tight text-white">
            {stats[key] === null ? "—" : stats[key]}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-(--color-text-muted)">
            {translate(labelKey)}
          </p>
        </Link>
      ))}
    </div>
  );
}
