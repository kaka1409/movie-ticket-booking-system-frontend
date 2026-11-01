"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Clapperboard, Home, Ticket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import StatusPageShell from "@/components/shared/StatusPageShell";
import NotFoundArt from "@/components/shared/NotFoundArt";

const DIGITS = ["4", "0", "4"] as const;

/**
 * Responsive 404 (Not Found) screen:
 * - Mobile (< md): Retains the original container-less, centered film-strip scroll digits and quick links.
 * - Tablet & Desktop (>= md): Expands to a 50/50 split container matching Home (`max-w-7xl`),
 *   featuring dedicated interactive abstract cinema art on the left, and navigation options +
 *   3 expandable suggestion accordions on the right.
 */
export default function NotFound() {
  const router = useRouter();
  const { translate } = useLocale();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleSuggestion = (index: number) => {
    setExpandedIndex((previous) => (previous === index ? null : index));
  };

  const suggestionItems = [
    {
      id: "01",
      icon: Clapperboard,
      href: "/movies",
      title: translate("not_found.item_1_title"),
      description: translate("not_found.item_1_desc"),
      actionLabel: translate("not_found.item_1_action"),
    },
    {
      id: "02",
      icon: Ticket,
      href: "/tickets",
      title: translate("not_found.item_2_title"),
      description: translate("not_found.item_2_desc"),
      actionLabel: translate("not_found.item_2_action"),
    },
    {
      id: "03",
      icon: Home,
      href: "/",
      title: translate("not_found.item_3_title"),
      description: translate("not_found.item_3_desc"),
      actionLabel: translate("not_found.item_3_action"),
    },
  ];

  return (
    <StatusPageShell layout="centered">
      {/* ─── MOBILE VIEW (< md): Original Container-less Stack ─── */}
      <div className="flex w-full max-w-xs flex-col items-center text-center md:hidden">
        <Logo size="lg" />

        <div className="mt-12 flex items-baseline gap-1" aria-hidden>
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

        <h1 className="mt-6 text-xl font-bold text-(--color-text-primary) opacity-0 animate-fade-in">
          {translate("common.not_found")}
        </h1>

        <p className="mt-2 text-sm text-(--color-text-muted) opacity-0 animate-fade-in">
          {translate("common.not_found_desc")}
        </p>

        <div className="mt-8 flex w-full flex-col gap-2.5 opacity-0 animate-fade-in">
          <Link href="/" className="w-full">
            <Button
              variant="primary"
              size="md"
              icon={Home}
              iconPosition="left"
              className="w-full rounded-xl"
            >
              {translate("not_found.back_home")}
            </Button>
          </Link>
          <Link href="/movies" className="w-full">
            <Button
              variant="outline"
              size="md"
              icon={Clapperboard}
              iconPosition="left"
              className="w-full rounded-xl"
            >
              {translate("not_found.explore_movies")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── TABLET & DESKTOP VIEW (>= md): 50/50 Split Showcase (max-w-7xl) ─── */}
      <div className="surface-raised mx-auto hidden w-full max-w-7xl overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) md:block md:rounded-3xl">
        <div className="grid min-h-[580px] grid-cols-2 lg:min-h-[640px]">
          {/* Left Column (50%): Abstract Cinema 404 Art */}
          <div className="border-r border-(--color-border)">
            <NotFoundArt />
          </div>

          {/* Right Column (50%): Information & Interactive Destination Accordions */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-(--color-text-primary) sm:text-3xl lg:text-4xl">
                {translate("not_found.desktop_title")}
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-(--color-text-muted)">
                {translate("not_found.desktop_desc")}
              </p>

              {/* Desktop-refined inline CTA pair */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={Home}
                  iconPosition="left"
                  href="/"
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold shadow-none"
                >
                  {translate("not_found.back_home")}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={Clapperboard}
                  iconPosition="left"
                  href="/movies"
                  fullWidth={false}
                  uppercase={false}
                  className="sm:min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-bold"
                >
                  {translate("not_found.explore_movies")}
                </Button>
              </div>
            </div>

            {/* 3 Destination Accordions with Navigation Links */}
            <div className="mt-10 border-t border-(--color-border) pt-6">
              <p className="mb-3 text-2xs font-bold uppercase tracking-[0.2em] text-(--color-text-muted)">
                {translate("not_found.heading_suggestions")}
              </p>

              <div className="flex flex-col gap-2.5">
                {suggestionItems.map((item, index) => {
                  const isExpanded = expandedIndex === index;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all duration-200 ${
                        isExpanded
                          ? "border-(--color-gold)/40 bg-(--color-surface-2)"
                          : "border-(--color-border) bg-transparent hover:border-(--color-border-strong)"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSuggestion(index)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-(--color-surface) text-(--color-gold)">
                            <Icon size={14} />
                          </span>
                          <span className="text-xs font-bold text-(--color-text-primary)">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-(--color-text-muted) transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-(--color-gold)" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-all duration-200 ease-out ${
                          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex items-center justify-between px-4 pb-3 pt-0.5">
                            <p className="text-2xs leading-relaxed text-(--color-text-muted)">
                              {item.description}
                            </p>
                            <Link
                              href={item.href}
                              className="group inline-flex shrink-0 items-center gap-1 text-2xs font-bold text-(--color-gold) hover:underline pl-3"
                            >
                              <span>{item.actionLabel}</span>
                              <ChevronRight
                                size={12}
                                className="transition-transform group-hover:translate-x-0.5"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Back & Cinema Brand Line */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-3xs text-(--color-text-muted)">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="hover:text-(--color-gold) transition-colors"
                >
                  ← {translate("not_found.go_back")}
                </button>
                <span>{translate("not_found.cinema_support")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StatusPageShell>
  );
}
