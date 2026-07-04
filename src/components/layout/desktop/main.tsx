"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Search, Bell, SlidersHorizontal, Settings, X, Play, Camera, BookOpen } from "lucide-react";
import { APP_NAME } from "@/libs/constants";

/* ─── Header ─────────────────────────────────────────────────── */
function Header() {
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

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-16 border-t border-(--color-border) bg-(--color-bg) pb-6 pt-12">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10 grid grid-cols-[1.8fr_1fr_1fr_1.6fr] gap-10">
          {/* Brand */}
          <div>
            <div className="mb-3.5 flex items-center gap-2">
              <Image src="/images/logo.png" alt="Logo" width={28} height={28} className="rounded-full" />
              <span className="text-[15px] font-extrabold text-(--color-gold-light)">
                PrimeSeat
              </span>
            </div>
            <p className="mb-5 max-w-[220px] text-xs leading-relaxed text-(--color-text-muted)">
              Redefining the premium movie-going experience since 2012. Join us for a world of
              cinematic wonders and exclusive perks.
            </p>
            <div className="flex gap-2.5">
              {[X, Play, Camera, BookOpen].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-(--color-border) bg-transparent text-(--color-text-muted)"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Cinema links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              Cinema
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {["Find a Cinema", "Movie Grids", "Cinematic Tech", "Sitemap"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light)">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold tracking-widest uppercase text-white">
              Support
            </h4>
            <ul className="flex list-none flex-col gap-2.5">
              {["Help Center", "Contact Us", "Gift Cards", "Refunds"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-(--color-text-muted) no-underline hover:text-(--color-gold-light)">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-2 text-[11px] font-bold tracking-widest uppercase text-white">
              Subscribe to Premiere
            </h4>
            <p className="mb-3.5 text-xs leading-relaxed text-(--color-text-muted)">
              Get weekly updates on exclusive screenings and early bird offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-r-0 border-(--color-border) bg-(--color-surface) px-3.5 py-2.5 text-xs text-white outline-none font-sans rounded-l-(--radius-sm)"
              />
              <button className="cursor-pointer rounded-r-(--radius-sm) border-none bg-(--color-gold) px-4 py-2.5 text-xs font-extrabold text-black">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-(--color-border) pt-5">
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[11px] text-(--color-text-muted) no-underline tracking-wide"
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-(--color-text-muted)">
            &copy; 2026 PrimeSeat Cinemas Entertainment Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── DesktopMainLayout ──────────────────────────────────────── */
export default function DesktopMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
