"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { FILTER_LABEL_CLASS } from "../shared/FilterLabel";

/**
 * Collapsible block of the desktop filter sidebar: the section label doubles as
 * the toggle (whole row clickable, `aria-expanded` + `aria-controls`), with the
 * chevron flipping on open and the body mounted only while open — reusing the
 * app's existing `animate-fade-in` enter animation.
 *
 * `badge` keeps a folded section honest: the sidebar renders it from the draft
 * filter state, the same source as the controls inside, so a collapsed section
 * still shows that it holds a setting. It is decorative (the section's own
 * controls carry the accessible labels) and therefore hidden from screen
 * readers.
 *
 * Open state is local: every section starts expanded (the user folds what they
 * do not need), and a re-mount — e.g. the mobile/desktop device switch —
 * returns to that default.
 */
export default function FilterSection({
  title,
  badge,
  className = "",
  children,
}: {
  /** Section name; styled like the mobile panel's `FilterLabel`. */
  title: string;
  /** Indicator shown while the section holds a setting (a dot, or a count). */
  badge?: ReactNode;
  /** Placed by the caller's own grid (the sidebar's tablet two-up layout). */
  className?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const bodyId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        className="flex min-h-9 w-full items-center justify-between gap-2"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className={FILTER_LABEL_CLASS}>{title}</span>
          <span aria-hidden="true" className="flex items-center">
            {badge}
          </span>
        </span>

        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`shrink-0 text-(--color-text-muted) transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div id={bodyId} className="animate-fade-in pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
