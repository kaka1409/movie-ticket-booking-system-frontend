"use client";

import Link from "next/link";
import { ChevronRight, Clapperboard, Home, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import StatusPageShell, { StatusPanel } from "@/components/shared/StatusPageShell";

const DIGITS = ["4", "0", "4"] as const;

const QUICK_LINKS = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/movies", labelKey: "nav.movies", icon: Clapperboard },
  { href: "/tickets", labelKey: "nav.tickets", icon: Ticket },
] as const;

export default function NotFound() {
  const { translate } = useLocale();

  return (
    <StatusPageShell
      aside={
        <StatusPanel title={translate("not_found.try_these")}>
          {QUICK_LINKS.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-(--color-gold)/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-bg) text-(--color-gold)">
                <Icon size={18} />
              </span>
              <span className="flex-1 text-sm font-semibold text-(--color-text-primary)">
                {translate(labelKey)}
              </span>
              <ChevronRight
                size={16}
                className="text-(--color-text-muted) transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </StatusPanel>
      }
    >
      <Logo size="lg" />

      <div className="mt-12 flex items-baseline gap-1 md:mt-10 md:gap-2" aria-hidden>
        {DIGITS.map((digit, index) => (
          <span
            key={index}
            className="inline-block text-7xl font-black tracking-widest text-(--color-gold) opacity-0 md:text-[10rem]"
            style={{
              animation: `filmStripScroll 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
              animationDelay: `${index * 150}ms`,
            }}
          >
            {digit}
          </span>
        ))}
      </div>

      <h1 className="mt-6 text-xl font-bold text-(--color-text-primary) opacity-0 animate-fade-in md:text-4xl md:font-extrabold md:tracking-tight">
        {translate("common.not_found")}
      </h1>

      <p className="mt-2 max-w-xs text-center text-sm text-(--color-text-muted) opacity-0 animate-fade-in md:mt-4 md:max-w-md md:text-left md:text-base md:leading-relaxed">
        {translate("common.not_found_desc")}
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2 opacity-0 animate-fade-in md:hidden">
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
    </StatusPageShell>
  );
}
