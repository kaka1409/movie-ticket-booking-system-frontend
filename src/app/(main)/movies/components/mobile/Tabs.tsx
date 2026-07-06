"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { useMovies } from "@/contexts/MoviesContext";

export default function Tabs() {
  const { t } = useLocale();
  const { activeTab, setActiveTab } = useMovies();

  return (
    <div className="flex gap-0 border-b border-(--color-border) px-(--space-md)">
      {(["now_showing", "coming_soon"] as const).map((tab) => {
        const label =
          tab === "now_showing"
            ? t("movies.now_showing")
            : t("movies.coming_soon");
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              relative mr-6 pb-3 px-1 text-sm font-bold tracking-wide transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `}
          >
            {label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
            )}
          </button>
        );
      })}
    </div>
  );
}
