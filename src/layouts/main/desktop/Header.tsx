"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LogIn } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { buildLoginUrl } from "@/libs/utils";
import Logo from "@/components/ui/Logo";
import LanguageToggle from "@/layouts/components/LanguageToggle";
import NotificationBell from "./NotificationBell";
import AccountMenu from "./AccountMenu";

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

/* Auth screens bring their own card and CTA; a header "Login" button on top of
   them is noise. The profile chip still wins when a session exists. */
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"] as const;

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function Header() {
  const { translate } = useLocale();
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-nav border-b print:hidden border-(--color-border) bg-black/92 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-4 px-4 lg:gap-8 lg:px-8">
        <Logo size="lg" tagline />

        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ labelKey, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-(--radius-sm) px-2 py-1.5 text-[13px] no-underline lg:px-3.5 ${
                isActiveLink(href, pathname)
                  ? "border-b-2 border-(--color-gold) font-bold text-(--color-gold)"
                  : "border-b-2 border-transparent font-medium text-(--color-text-secondary)"
              }`}
            >
              {translate(labelKey)}
            </Link>
          ))}
        </div>

        {/* Native GET form — the same contract as the mobile home search bar. */}
        <div className="ml-auto flex items-center gap-3">
          <form
            action="/movies"
            method="get"
            className="
            flex h-fit max-w-[160px] flex-1 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) 
            bg-(--color-surface) px-3.5 py-2 lg:max-w-[280px]"
          >
            <Search size={16} className="shrink-0 text-(--color-text-muted)" />
            <input
              type="search"
              name="q"
              placeholder={translate("layout.header.search")}
              aria-label={translate("layout.header.search")}
              className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
            />
          </form>

          <div className="flex items-center gap-3 text-(--color-text-muted)">
            <LanguageToggle variant="flag" />
            <NotificationBell />
          </div>

          {isLoading ? (
            <div
              aria-hidden
              className="h-9 w-32 shrink-0 animate-pulse rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface)"
            />
          ) : isAuthenticated && user ? (
            <AccountMenu />
          ) : isAuthRoute(pathname) ? null : (
            <Link
              href={buildLoginUrl(pathname)}
              className="flex shrink-0 items-center gap-2 rounded-(--radius-pill) bg-(--color-gold) px-4 py-2 text-xs font-extrabold tracking-wide text-black uppercase no-underline"
            >
              <LogIn size={15} strokeWidth={2.2} />
              {translate("layout.header.login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
