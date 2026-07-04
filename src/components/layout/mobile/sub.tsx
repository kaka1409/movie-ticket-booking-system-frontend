"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface MobileSubLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MobileSubLayout({
  children,
  title,
  subtitle,
}: MobileSubLayoutProps) {
  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-(--color-border)">
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-(--color-gold-light)" />
        </Link>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-(--color-gold-light)">
            {title}
          </h1>
          {subtitle && (
            <span className="w-5 h-5 rounded-full bg-(--color-gold) text-(--color-bg) text-[10px] font-black flex items-center justify-center">
              {subtitle}
            </span>
          )}
        </div>

        <div className="w-9 h-9" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
