"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LanguageToggle from "@/layouts/components/LanguageToggle";
import { useLocale } from "@/contexts/LocaleContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { translate } = useLocale();

  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="h-9 flex items-center gap-2 rounded-full hover:bg-(--color-surface)"
          aria-label={translate("layout.sub.back")}
        >
          <ArrowLeft size={22} className="text-(--color-gold-light)" />

          <span className="text-(--color-gold-light)">{translate("layout.auth.home")}</span>
        </button>

        <LanguageToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">{children}</main>
    </div>
  );
}
