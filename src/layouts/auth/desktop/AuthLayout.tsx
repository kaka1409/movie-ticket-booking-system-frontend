"use client";

import { Search } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { translate } = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
          <Logo size="lg" tagline />

          <div className="ml-auto flex items-center gap-3.5 text-(--color-text-muted)">
            <div className="flex max-w-[280px] items-center gap-2 rounded-(--radius-pill) border border-(--color-border) bg-(--color-surface) px-3.5 py-2 text-[13px] text-(--color-text-muted)">
              <Search size={16} />
              <span>{translate("layout.header.search")}</span>
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
