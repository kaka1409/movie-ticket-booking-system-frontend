"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLocale } from "@/contexts/LocaleContext";

/* ─── Logo ───────────────────────────────────────────────────── */
const Logo: React.FC = () => (
  <Link href="/" className="flex items-center gap-2 select-none">
    <Image src="/images/logo.png" alt="Logo" width={20} height={20} />
    <span className="text-(--color-gold-light) font-extrabold text-lg tracking-tight">
      PRIMESEAT
    </span>
  </Link>
);

/* ─── MobileAuthLayout ───────────────────────────────────────── */
export default function MobileAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, setLocale } = useLocale();

  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col">
      <header className="sticky bg-(--color-bg) top-0 z-40 w-full">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <Logo />

          <button
            className="text-xs font-semibold tracking-widest px-2 py-1 rounded text-(--color-gold-light) border border-(--color-border)"
            aria-label="Change language"
            onClick={() => setLocale(locale === "en" ? "vn" : "en")}
          >
            {locale === "en" ? "EN" : "VN"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
}
