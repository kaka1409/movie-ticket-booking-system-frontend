import { Heart, LockKeyhole, Star, UserCog, UserRound } from "lucide-react";

export type AccountSection = "overview" | "edit" | "password" | "reviews" | "wishlist";

export interface AccountSectionEntry {
  key: AccountSection;
  group: "account" | "activity";
  labelKey: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
}

/**
 * Single source of truth for the desktop account navigation (and the header
 * account popup). Order mirrors the mobile `ProfileMenu` so the two skins agree.
 */
export const ACCOUNT_SECTIONS: readonly AccountSectionEntry[] = [
  {
    key: "overview",
    group: "account",
    labelKey: "profile.overview",
    href: "/profile",
    Icon: UserRound,
  },
  {
    key: "edit",
    group: "account",
    labelKey: "profile.edit_profile",
    href: "/profile/edit",
    Icon: UserCog,
  },
  {
    key: "password",
    group: "account",
    labelKey: "profile.change_password",
    href: "/profile/password",
    Icon: LockKeyhole,
  },
  {
    key: "reviews",
    group: "activity",
    labelKey: "profile.review_rating",
    href: "/profile/reviews",
    Icon: Star,
  },
  {
    key: "wishlist",
    group: "activity",
    labelKey: "profile.wishlist_label",
    href: "/profile/wishlist",
    Icon: Heart,
  },
] as const;

export function accountSectionForPathname(pathname: string): AccountSection | null {
  // A trailing slash (`/profile/`) is the same route as `/profile`; the longest
  // href wins so a future nested route still lights up its own parent section
  // instead of falling back to the `/profile` prefix.
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const match = [...ACCOUNT_SECTIONS]
    .sort((left, right) => right.href.length - left.href.length)
    .find((section) => normalized === section.href || normalized.startsWith(`${section.href}/`));
  return match ? match.key : null;
}
