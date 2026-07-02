"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Bell } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/* ─── PrimeSeat logo ───────────────────────────── */
const Logo: React.FC = () => (
  <Link href="/" className="flex items-center gap-2 select-none">
    {/* Seat + film-strip icon, faithful to brand mark */}
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={20}
      height={20}
    />
    <span
      className="text-(--color-gold-light) font-extrabold text-lg tracking-tight"
    >
      PRIMESEAT
    </span>
  </Link>
);

/* ─── Header ─────────────────────────────────────────────────── */
const Header: React.FC = () => {
  const { locale, setLocale } = useLocale();

  return (
    <header
      className="sticky bg-(--color-bg) top-0 z-40 w-full"
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
        <Logo />

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            className="text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
            aria-label="Change language"
            onClick={() => setLocale(locale === "en" ? "vn" : "en")}
          >
            {locale === "en" ? "EN" : "VN"}
          </button>

          {/* Notification bell */}
          <button
            className="relative text-(--color-gold-light)"
            aria-label="Notifications"
          >
            <Bell />
            {/* Unread dot */}
            <span
              className="absolute top-0 right-0 w-2 h-2 rounded-full bg-(--color-gold)"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
