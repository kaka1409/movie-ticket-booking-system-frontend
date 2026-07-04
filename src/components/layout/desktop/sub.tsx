"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

interface DesktopSubLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DesktopSubLayout({
  children,
  title,
}: DesktopSubLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 no-underline"
          >
            <ArrowLeft size={20} className="text-(--color-gold)" />
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
            <span className="text-[15px] font-extrabold tracking-tight text-(--color-gold-light)">
              PrimeSeat
            </span>
          </Link>

          {title && (
            <h1 className="text-lg font-bold text-(--color-gold-light)">
              {title}
            </h1>
          )}
        </div>
      </nav>

      <main className="w-full flex-1 max-w-7xl mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
