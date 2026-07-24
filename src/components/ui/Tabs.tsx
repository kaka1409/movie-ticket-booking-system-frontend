"use client";

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-0 border-b border-(--color-border) px-(--space-md)">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative mr-6 pb-3 px-1 text-sm font-bold tracking-wide transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
            )}
          </button>
        );
      })}
    </div>
  );
}
