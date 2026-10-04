"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/layouts/components/Logo";
import LanguageToggle from "@/layouts/components/LanguageToggle";

const NAV_LINKS = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.movies", href: "/movies" },
  { labelKey: "nav.tickets", href: "/tickets" },
] as const;

/* "/" only matches exactly, every other link also matches its sub-routes
   so a movie detail page still highlights "Movies". */
function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const { translate } = useLocale();
  const { user } = useAuth();
  const pathname = usePathname();

  const displayName = user?.name ?? translate("layout.header.guest");
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "?";

  return (
    <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
        <Logo size="lg" tagline />

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ labelKey, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-(--radius-sm) px-3.5 py-1.5 text-[13px] no-underline ${
                isActiveLink(href, pathname)
                  ? "border-b-2 border-(--color-gold) font-bold text-(--color-gold)"
                  : "border-b-2 border-transparent font-medium text-(--color-text-secondary)"
              }`}
            >
              {translate(labelKey)}
            </Link>
          ))}
        </div>

        <div
          className="
          ml-auto flex max-w-[280px] h-fit flex-1 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) 
          bg-(--color-surface) px-3.5 py-2 text-[13px] text-(--color-text-muted)"
        >
          <Search size={16} />
          <span>{translate("layout.header.search")}</span>
        </div>

        <div className="flex items-center gap-3.5 text-(--color-text-muted)">
          <LanguageToggle variant="text" />
          <button
            type="button"
            className="relative cursor-pointer border-none bg-transparent p-1 text-inherit"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-(--color-gold)" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) pl-1.5 pr-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-(--color-gold) to-(--color-gold-dark) text-[11px] font-extrabold text-black">
            {initials}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-white">{displayName}</p>
            <p className="text-[9px] font-semibold tracking-widest text-(--color-gold) uppercase">
              {translate("layout.header.gold_member")}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
