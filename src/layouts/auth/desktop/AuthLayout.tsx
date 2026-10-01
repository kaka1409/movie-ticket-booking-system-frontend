"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@/layouts/components/Logo";
import LanguageToggle from "@/layouts/components/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { translate } = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg)">
      <nav className="sticky top-0 z-50 border-b border-(--color-border) bg-black/92 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center gap-8 px-8">
          <button type="button"
            onClick={() => router.push("/")}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
            aria-label={translate("layout.sub.back")}
          >
            <ArrowLeft size={22} className="text-(--color-gold-light)" />
          </button>

          <Logo size="lg" tagline />

          <div className="ml-auto">
            <LanguageToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-8">
        {children}
      </main>
    </div>
  );
}
