"use client";

import Link from "next/link";

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  linkFor,
  stretch = true,
  className = "",
}: {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  /** Required for the button variant; omitted when `linkFor` navigates instead. */
  onTabChange?: (tab: string) => void;
  /** When given, tabs render as navigation links instead of state buttons. */
  linkFor?: (key: string) => string;
  /** Split the row evenly (mobile) instead of sizing each tab to its label (desktop). */
  stretch?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex border-b border-(--color-border) ${stretch ? "" : "gap-8"} ${className}`}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const tabClassName = `
              relative ${stretch ? "flex-1" : ""} pb-3 px-1 text-sm font-bold tracking-wide text-center transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `;
        const underline = active && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
        );
        return linkFor ? (
          <Link key={tab.key} href={linkFor(tab.key)} className={tabClassName}>
            {tab.label}
            {underline}
          </Link>
        ) : (
          <button
            type="button"
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            className={tabClassName}
          >
            {tab.label}
            {underline}
          </button>
        );
      })}
    </div>
  );
}
