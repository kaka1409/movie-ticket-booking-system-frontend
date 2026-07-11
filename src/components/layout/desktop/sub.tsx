"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ALL_MOVIES } from "@/features/movies/mock";

function getSubTitle(pathname: string): string {
  if (pathname.startsWith("/tickets")) return "Ticket Details";
  if (pathname.startsWith("/booking/")) {
    if (pathname.includes("/cinema")) return "Cinema & Showtime";
    if (pathname.includes("/seats")) return "Select Seat";
    return "";
  }
  if (pathname.startsWith("/movies/")) {
    const slug = pathname.split("/movies/")[1];
    const movie = ALL_MOVIES.find((m) => m.slug === slug);
    return movie?.title ?? "";
  }
  return "";
}

export default function DesktopSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getSubTitle(pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
          <Link
            href={
              pathname.startsWith("/tickets")
                ? "/tickets"
                : pathname.startsWith("/booking/")
                ? pathname.includes("/cinema")
                  ? `/movies/${pathname.split("/booking/")[1]?.split("/")[0]}`
                  : pathname.includes("/seats")
                  ? `/booking/${pathname.split("/booking/")[1]?.split("/")[0]}/cinema`
                  : `/movies/${pathname.split("/booking/")[1]?.split("/")[0]}`
                : "/"
            }
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
