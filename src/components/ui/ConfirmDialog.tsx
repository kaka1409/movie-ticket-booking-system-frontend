"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { lockBodyScroll } from "@/libs/scroll-lock";

/**
 * Desktop confirmation modal. `ActionSheet` is a bottom sheet â€” correct on a
 * phone, wrong on a 1280px canvas â€” so the desktop skins need a centred dialog
 * with the same guarantees: `Escape` and a backdrop click dismiss it, `Tab` is
 * trapped inside while it is open, and focus returns to whatever opened it.
 *
 * Mounted only while open, so the focus hand-back rides on the unmount cleanup.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending = false,
  danger = true,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Blocks both buttons and swaps the confirm label for a spinner. */
  isPending?: boolean;
  /** Red confirm button (an irreversible action) vs the gold primary one. */
  danger?: boolean;
  /** Extra content between the copy and the buttons (refund amount, warnings). */
  children?: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const restoredFocusRef = useRef<HTMLElement | null>(null);
  // Kept in a ref so a caller passing an inline `onClose` cannot re-run the
  // focus effect on every render (which would refocus the dialog mid-typing).
  // Assigned in an effect, never during render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    restoredFocusRef.current = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    const releaseScrollLock = lockBodyScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      releaseScrollLock();
      restoredFocusRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-overlay flex items-center justify-center p-4">
      <div
        className="absolute inset-0 cursor-pointer bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="animate-fade-in relative w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card)"
      >
        <h2 id={titleId} className="text-lg font-extrabold text-(--color-text-primary)">
          {title}
        </h2>

        {description && (
          <p id={descriptionId} className="mt-2 text-sm text-(--color-text-muted)">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 space-y-3">
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`flex w-full items-center justify-center gap-2 py-3.5 rounded-2xl font-extrabold text-sm tracking-widest uppercase border bg-transparent transition duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${
              danger ? "border-red-500 text-red-500" : "border-(--color-gold) text-(--color-gold)"
            }`}
          >
            {confirmLabel}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-widest uppercase text-(--color-on-accent) bg-(--color-gold) transition duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
