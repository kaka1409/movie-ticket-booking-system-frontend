"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistEmptyState() {
  const { translate } = useLocale();
  return (
    <EmptyState
      icon={Heart}
      title={translate("profile.wishlist.empty_title")}
      description={translate("profile.wishlist.empty_desc")}
    >
      <Link
        href="/movies"
        className="flex items-center gap-2 rounded-xl bg-(--color-gold) px-6 py-3 text-sm font-extrabold tracking-wide text-black"
      >
        <Search size={16} />
        {translate("profile.wishlist.browse")}
      </Link>
    </EmptyState>
  );
}
