"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Bell, SlidersHorizontal, Settings } from "lucide-react";

export default function Header() {
  return (
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

        <div className="flex items-center gap-1">
          {(["Home", "Movies", "Tickets"] as const).map((item) => (
            <Link
              key={item}
              href={`/${item === "Home" ? "" : item.toLowerCase()}`}
              className={`rounded-(--radius-sm) px-3.5 py-1.5 text-[13px] no-underline ${
                item === "Home"
                  ? "border-b-2 border-(--color-gold) font-bold text-(--color-gold)"
                  : "border-b-2 border-transparent font-medium text-(--color-text-secondary)"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex max-w-[280px] flex-1 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-3.5 py-2 text-[13px] text-(--color-text-muted)">
          <Search size={16} />
          <span>Search movies, actors…</span>
        </div>

        <div className="flex items-center gap-3.5 text-(--color-text-muted)">
          <button className="cursor-pointer border-none bg-transparent p-1 text-inherit">
            <SlidersHorizontal size={18} />
          </button>
          <button className="cursor-pointer border-none bg-transparent p-1 text-inherit">
            <Settings size={18} />
          </button>
          <button className="relative cursor-pointer border-none bg-transparent p-1 text-inherit">
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-(--color-gold)" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) pl-1.5 pr-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-(--color-gold) to-(--color-gold-dark) text-[11px] font-extrabold text-black">
            AR
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-white">Alex Rivers</p>
            <p className="text-[9px] font-semibold tracking-widest text-(--color-gold) uppercase">GOLD MEMBER</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
