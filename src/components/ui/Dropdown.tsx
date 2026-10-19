"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export interface DropdownRenderState {
  isOpen: boolean;
  close: () => void;
}

interface DropdownProps {
  /** Accessible name for the trigger button (icon-only triggers). */
  label: string;
  /** Trigger content; the button itself (and its aria wiring) is owned here. */
  trigger: (state: DropdownRenderState) => ReactNode;
  /** Panel content. Call `close` from any action that should dismiss it. */
  children: ReactNode | ((state: DropdownRenderState) => ReactNode);
  /** Panel width/padding classes. */
  panelClassName?: string;
  role?: "dialog" | "menu";
}

/**
 * Header popover primitive: a trigger button plus a panel anchored under it.
 *
 * Owns the behaviour every popover in the header needs — click toggles, a
 * `pointerdown` outside closes (so the trigger's own click never races the
 * close), `Escape` closes and hands focus back to the trigger, closing from
 * inside the panel also hands focus back (so a keyboard user is never dropped on
 * `<body>`), and a route change closes it (`DropdownBody` is keyed on the
 * pathname, so navigating from a link inside the panel remounts it shut instead
 * of leaving it open behind the new page).
 *
 * The panel is `absolute right-0` under the trigger and portaled nowhere: the
 * header is `sticky` with `z-50`, so a `z-50` panel inside it paints above the
 * page without escaping its stacking context.
 */
export default function Dropdown(props: DropdownProps) {
  const pathname = usePathname();

  return <DropdownBody key={pathname} {...props} />;
}

function DropdownBody({
  label,
  trigger,
  children,
  panelClassName = "",
  role = "dialog",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = useCallback(() => setIsOpen(false), []);

  // Outside pointerdown. `pointerdown` (not `click`) so the panel closes on the
  // press, before a drag can start inside it.
  useEffect(() => {
    if (!isOpen) return;

    // Captured for the cleanup: for an unmounting panel these are the nodes the
    // effect was set up with, which is exactly the pair we want.
    const panel = panelRef.current;
    const trigger = triggerRef.current;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      // Roving focus for the menu flavour (WAI-ARIA menu pattern). The list
      // flavour stays a plain dialog and keeps native Tab order.
      if (role !== "menu" || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;

      const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items?.length) return;

      event.preventDefault();
      const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);
      const offset = event.key === "ArrowDown" ? 1 : -1;
      items[(currentIndex + offset + items.length) % items.length].focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);

      // The panel is going away. If focus was inside it (a close button, a row)
      // hand it back to the trigger — otherwise the browser drops the keyboard
      // user on `<body>`. An outside pointerdown is safe: the browser's own
      // focus move for that click happens *after* this cleanup.
      if (panel?.contains(document.activeElement)) {
        trigger?.focus();
      }
    };
  }, [isOpen, role]);

  const state: DropdownRenderState = { isOpen, close };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup={role}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex cursor-pointer items-center"
      >
        {trigger(state)}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role={role}
          aria-label={label}
          className={`animate-fade-in absolute top-[calc(100%+10px)] right-0 z-50 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) ${panelClassName}`}
        >
          {typeof children === "function" ? children(state) : children}
        </div>
      )}
    </div>
  );
}
