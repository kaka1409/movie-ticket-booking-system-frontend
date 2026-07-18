"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function EmptyState() {
  const { translate } = useLocale();
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface)">
        <Heart size={28} className="text-(--color-text-muted)" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-(--color-text-primary)">
          {translate("profile.wishlist.empty_title")}
        </p>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          {translate("profile.wishlist.empty_desc")}
        </p>
      </div>
      <Link
        href="/movies"
        className="flex items-center gap-2 rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black"
      >
        <Search size={16} />
        {translate("profile.wishlist.browse")}
      </Link>
    </div>
  );
}
