"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { Bell, Home, Clapperboard, Ticket, User } from "lucide-react";

/* ─── Logo ───────────────────────────────────────────────────── */
const Logo: React.FC = () => (
  <Link href="/" className="flex items-center gap-2 select-none">
    <Image src="/images/logo.png" alt="Logo" width={20} height={20} />
    <span className="text-(--color-gold-light) font-extrabold text-lg tracking-tight">
      PRIMESEAT
    </span>
  </Link>
);

/* ─── Header ─────────────────────────────────────────────────── */
function Header() {
  const { locale, setLocale } = useLocale();

  return (
    <header className="sticky bg-(--color-bg) top-0 z-40 w-full">
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <Logo />

        <div className="flex items-center gap-3">
          <button
            className="text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
            aria-label="Change language"
            onClick={() => setLocale(locale === "en" ? "vn" : "en")}
          >
            {locale === "en" ? "EN" : "VN"}
          </button>

          <Link
            href="/notifications"
            className="relative text-(--color-gold-light)"
            aria-label="Notifications"
          >
            <Bell  className="w-5 h-5"/>
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-(--color-gold)" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── BottomNav ──────────────────────────────────────────────── */
const ICON_SIZE = 20;

const navItems = [
  { key: "nav.home", href: "/", icon: Home },
  { key: "nav.movies", href: "/movies", icon: Clapperboard },
  { key: "nav.tickets", href: "/tickets", icon: Ticket },
  { key: "nav.profile", href: "/profile", icon: User },
] as const;

function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-(--color-surface) border-t border-(--color-border)"
      aria-label="Main navigation"
    >
      <ul className="flex justify-around items-center">
        {navItems.map(({ key, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center w-full px-(--space-md)"
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex flex-col items-center w-full p-1 text-sm ${
                    isActive
                      ? "text-(--color-gold-light) bg-(--color-gold-light)/20 rounded-(--radius-md)"
                      : "text-(--color-text-muted)"
                  }`}
                >
                  <Icon
                    size={ICON_SIZE}
                    fill={isActive ? "currentColor" : "none"}
                  />
                  <span>{t(key)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ─── MobileMainLayout ───────────────────────────────────────── */
export default function MobileMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
