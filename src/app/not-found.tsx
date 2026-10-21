"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/layouts/components/Logo";
import Button from "@/components/ui/Button";
import { Home, Clapperboard } from "lucide-react";

const DIGITS = ["4", "0", "4"] as const;

export default function NotFound() {
  const { translate } = useLocale();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-(--color-bg)">
      <Logo size="lg" />

      <div className="mt-14 flex items-baseline gap-1">
        {DIGITS.map((digit, index) => (
          <span
            key={index}
            className="inline-block text-7xl font-black tracking-widest text-(--color-gold) opacity-0"
            style={{
              animation: `filmStripScroll 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
              animationDelay: `${index * 150}ms`,
            }}
          >
            {digit}
          </span>
        ))}
      </div>

      {/* Heading — fades in after 404 settles */}
      <h1
        className="mt-6 text-xl font-bold text-(--color-text-primary) opacity-0 animate-fade-in"
        style={{ animationDelay: "600ms" }}
      >
        {translate("common.not_found")}
      </h1>

      <p
        className="mt-2 text-sm text-center text-(--color-text-muted) max-w-xs opacity-0 animate-fade-in"
        style={{ animationDelay: "700ms" }}
      >
        {translate("common.not_found_desc")}
      </p>

      <div
        className="flex flex-col gap-2 mt-8 w-full max-w-xs space-y-3 opacity-0 animate-fade-in"
        style={{ animationDelay: "850ms" }}
      >
        <Link href="/">
          <Button variant="primary" icon={Home} iconPosition="left">
            {translate("not_found.back_home")}
          </Button>
        </Link>
        <Link href="/movies">
          <Button variant="outline" icon={Clapperboard} iconPosition="left">
            {translate("not_found.explore_movies")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
