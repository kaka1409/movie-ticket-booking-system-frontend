"use client";

import Link from "next/link";
import { useId, useRef } from "react";

/** Id of a tab button (`role="tab"`) inside a `Tabs` instance. */
export const tabId = (idBase: string, key: string) => `${idBase}-tab-${key}`;

/** Id of the region (`role="tabpanel"`) a tab controls. */
export const tabPanelId = (idBase: string, key: string) => `${idBase}-panel-${key}`;

/**
 * Tab bar with two deliberately different semantics:
 *
 * - `linkFor` — the "tabs" are real links to another URL (auth login/register,
 *   the tickets pager), so they render inside a `<nav>` and mark the current
 *   one with `aria-current="page"`. They are **not** `role="tab"`: a link that
 *   navigates must keep link behaviour, or a screen-reader user is promised a
 *   panel that never appears.
 * - no `linkFor` — a state switch (`role="tablist"` + `role="tab"` +
 *   `aria-selected`). ArrowLeft/ArrowRight/Home/End move focus between tabs;
 *   Enter/Space activates (native button), i.e. **manual activation**, so
 *   arrowing across a tab that fetches (the movies catalogue) never fires a
 *   request per keypress. Only the active tab is in the Tab order (roving
 *   tabindex); when `activeTab` matches no tab the first one stays focusable so
 *   the list can never become keyboard-unreachable.
 *
 * Pass `idBase` when the consumer renders the controlled region as
 * `role="tabpanel"` — then tabs get `aria-controls` and stable ids built with
 * {@link tabId} / {@link tabPanelId}. Without it, tabs carry ids but no
 * `aria-controls`, which keeps filter-only bars (review sorting) valid without a
 * dangling reference.
 */
export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  linkFor,
  stretch = true,
  className = "",
  ariaLabel,
  idBase,
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
  /** Accessible name of the tablist / nav landmark. */
  ariaLabel?: string;
  /** Id prefix for the tab ⇄ panel pair, enabling `aria-controls`. */
  idBase?: string;
}) {
  const generatedIdBase = useId();
  const resolvedIdBase = idBase ?? generatedIdBase;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // A tablist with no selected tab would leave every tab at tabIndex -1.
  const matchedIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const activeIndex = matchedIndex === -1 ? 0 : matchedIndex;

  const containerClassName = `flex border-b border-(--color-border) ${stretch ? "" : "gap-8"} ${className}`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedIndex = tabRefs.current.findIndex((node) => node === document.activeElement);
    const from = focusedIndex === -1 ? activeIndex : focusedIndex;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (from + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = (from - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
  };

  if (linkFor) {
    const links = tabs.map((tab) => {
      const active = activeTab === tab.key;
      return (
        <Link
          key={tab.key}
          href={linkFor(tab.key)}
          aria-current={active ? "page" : undefined}
          className={`
              relative ${stretch ? "flex-1" : ""} pb-3 px-1 text-sm font-bold tracking-wide text-center transition-colors duration-150
              ${active ? "text-(--color-gold)" : "text-(--color-text-muted) hover:text-(--color-gold-light)"}
            `}
        >
          {tab.label}
          {active && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-(--color-gold)" />
          )}
        </Link>
      );
    });

    // A bare `div` when unnamed: an unlabelled `<nav>` landmark only adds noise.
    return ariaLabel ? (
      <nav aria-label={ariaLabel} className={containerClassName}>
        {links}
      </nav>
    ) : (
      <div className={containerClassName}>{links}</div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={containerClassName}
    >
      {tabs.map((tab, index) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={tabId(resolvedIdBase, tab.key)}
            aria-selected={active}
            aria-controls={idBase ? tabPanelId(idBase, tab.key) : undefined}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => onTabChange?.(tab.key)}
            className={`
              relative ${stretch ? "flex-1" : ""} pb-3 px-1 text-sm font-bold tracking-wide text-center transition-colors duration-150
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
