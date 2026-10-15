"use client";

import Link from "next/link";

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  linkFor,
}: {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  /** When given, tabs render as navigation links instead of state buttons. */
  linkFor?: (key: string) => string;
}) {
  return (
    <div className="flex gap-0 border-b border-(--color-border)">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const className = `
              relative flex-1 pb-3 px-1 text-sm text-center font-bold tracking-wide transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `;
        const underline = active && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
        );
        return linkFor ? (
          <Link key={tab.key} href={linkFor(tab.key)} className={className}>
            {tab.label}
            {underline}
          </Link>
        ) : (
          <button
            type="button"
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={className}
          >
            {tab.label}
            {underline}
          </button>
        );
      })}
    </div>
  );
}
