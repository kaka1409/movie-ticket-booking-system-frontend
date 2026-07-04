"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Search } from "lucide-react";

/* ─── DesktopAuthLayout ──────────────────────────────────────── */
export default function DesktopAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 no-underline">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="text-[15px] font-extrabold tracking-tight text-(--color-gold-light)">
              PrimeSeat
            </span>
            <span className="ml-1 text-[9px] font-semibold tracking-widest uppercase text-(--color-text-muted)">
              Cinematic Excellence
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3.5 text-(--color-text-muted)">
            <div className="flex max-w-[280px] items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-3.5 py-2 text-[13px] text-(--color-text-muted)">
              <Search size={16} />
              <span>Search movies, actors…</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-8">
        {children}
      </main>
    </div>
  );
}
