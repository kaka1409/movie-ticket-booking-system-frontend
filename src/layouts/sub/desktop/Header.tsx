"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { getSubTitle } from "../utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const title = getSubTitle(pathname);

  return (
    <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
        <button
          onClick={() => router.back()}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <ArrowLeft size={20} className="text-(--color-gold)" />
          <Logo size="lg" href="" />
        </button>

        {title && (
          <h1 className="text-lg font-bold text-(--color-gold-light)">
            {title}
          </h1>
        )}
      </div>
    </nav>
  );
}
