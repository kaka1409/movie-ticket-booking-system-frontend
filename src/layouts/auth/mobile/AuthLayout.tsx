"use client";

import Logo from "@/layouts/components/Logo";
import LanguageToggle from "@/layouts/components/LanguageToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-(--color-bg) flex flex-col">
      <header className="sticky bg-(--color-bg) top-0 z-40 w-full">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <Logo size="sm" />
          <LanguageToggle variant="text" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
}
