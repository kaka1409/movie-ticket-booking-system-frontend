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

export default function AccountStats({
  stats,
}: {
  stats: { reviews: number | null; wishlist: number | null; tickets: number | null };
}) {
  const { translate } = useLocale();

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {TILES.map(({ key, href, Icon, labelKey }) => (
        <Link
          key={key}
          href={href}
          className="group relative overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) p-4 transition-colors duration-150 hover:border-(--color-gold)/40"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-gold)">
              <Icon size={17} />
            </span>
            <ArrowUpRight
              size={15}
              aria-hidden
              className="text-(--color-text-muted) opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-white">
            {stats[key] === null ? "—" : stats[key]}
          </p>
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-(--color-text-muted)">
            {translate(labelKey)}
          </p>
        </Link>
      ))}
    </div>
  );
}
