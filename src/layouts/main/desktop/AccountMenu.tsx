"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import Avatar, { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import { HEADER_PRESS_CLASS, HEADER_TILE_CLASS } from "@/layouts/components/constants";
import { PRESS_SOFT_CLASS } from "@/libs/press";

/**
 * Account popup entries, grouped the way the mobile profile menu groups them —
 * the section labels reuse the same `profile.account` / `profile.activity` keys.
 */
function buildAccountGroups(isAdmin: boolean) {
  return [
    {
      labelKey: "profile.account",
      links: [
        { labelKey: "nav.profile", href: "/profile", Icon: UserRound },
        ...(isAdmin
          ? [{ labelKey: "layout.header.admin", href: "/admin", Icon: ShieldCheck }]
          : []),
        { labelKey: "profile.change_password", href: "/profile/password", Icon: LockKeyhole },
      ],
    },
    {
      labelKey: "profile.activity",
      links: [
        { labelKey: "profile.review_rating", href: "/profile/reviews", Icon: Star },
        { labelKey: "profile.wishlist_label", href: "/profile/wishlist", Icon: Heart },
      ],
    },
  ] as const;
}

/**
 * Icon tile shared by every popup row: sits on `--color-surface-2` and tints
 * gold with the row, so the row hover reads across the whole entry.
 */
const ROW_ICON_CLASS =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-2) text-(--color-text-secondary) transition-colors duration-150 group-hover:bg-(--color-gold)/15 group-hover:text-(--color-gold)";

/**
 * Desktop account popup: the header chip (avatar + name) opens a panel with the
 * member's identity, the profile destinations grouped under the same section
 * labels the mobile profile menu uses, and a red sign-out.
 *
 * The avatar falls back to the brand portrait when the member uploaded none.
 */
export default function AccountMenu() {
  const { translate } = useLocale();
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogout();

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const accountGroups = buildAccountGroups(isAdmin);

  return (
    <Dropdown
      label={translate("layout.header.account")}
      role="menu"
      panelClassName="w-72"
      trigger={({ isOpen }) => (
        <span
          className={`${HEADER_TILE_CLASS} ${HEADER_PRESS_CLASS} gap-1.5 pl-1 pr-2 ${
            isOpen
              ? "border-(--color-gold)/50 bg-(--color-gold)/10 text-(--color-gold)"
              : "bg-(--color-surface) text-(--color-text-muted) hover:border-(--color-gold)/40 hover:text-(--color-gold)"
          }`}
        >
          <Avatar
            src={user.avatarUrl}
            fallbackSrc={DEFAULT_AVATAR_SRC}
            name={user.name}
            size="h-7 w-7"
          />
          {/* Decorative: `aria-expanded` already reports the state — the
              rotation is what visually ties the panel to this chip. */}
          <ChevronDown
            size={14}
            aria-hidden
            className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center gap-3 border-b border-(--color-border) px-4 py-3">
            <Avatar
              src={user.avatarUrl}
              fallbackSrc={DEFAULT_AVATAR_SRC}
              name={user.name}
              size="h-10 w-10"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-(--color-text-muted)">{user.email}</p>
            </div>
          </div>

          <div className="p-1.5">
            {accountGroups.map(({ labelKey, links }) => (
              <div key={labelKey} role="group" aria-label={translate(labelKey)} className="py-1">
                {/* The group carries the accessible name; the visible caption is
                    decorative so it is never announced twice. */}
                <p
                  aria-hidden
                  className="px-2.5 pb-1 text-3xs font-bold tracking-widest text-(--color-text-muted) uppercase"
                >
                  {translate(labelKey)}
                </p>

                {links.map(({ labelKey: linkKey, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={`group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-semibold text-(--color-text-primary) no-underline hover:bg-(--color-surface-2) hover:text-(--color-gold) ${PRESS_SOFT_CLASS}`}
                  >
                    <span className={ROW_ICON_CLASS}>
                      <Icon size={14} aria-hidden />
                    </span>
                    <span className="flex-1">{translate(linkKey)}</span>
                    <ChevronRight
                      size={14}
                      aria-hidden
                      className="shrink-0 text-(--color-text-muted) opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-(--color-border) p-1.5">
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={() => {
                close();
                void logout();
              }}
              className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50 ${PRESS_SOFT_CLASS}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10 transition-colors duration-150 group-hover:bg-red-500/20">
                <LogOut size={14} aria-hidden />
              </span>
              <span className="flex-1">{translate("profile.logout")}</span>
            </button>
          </div>
        </>
      )}
    </Dropdown>
  );
}
