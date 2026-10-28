"use client";

/**
 * Reusable undo affordance for destructive toggles (wishlist removal). The mobile
 * skin pins it above the bottom nav; the desktop skin centres it near the bottom
 * of the viewport — the caller passes the placement via `className`.
 */
export default function UndoSnackbar({
  message,
  actionLabel,
  onAction,
  className = "",
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}) {
  return (
    <div
      className={`fixed z-50 flex items-center justify-between gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 shadow-(--shadow-card) ${className}`}
    >
      <p className="min-w-0 flex-1 truncate text-sm text-(--color-text-primary)">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="shrink-0 text-sm font-extrabold text-(--color-gold)"
      >
        {actionLabel}
      </button>
    </div>
  );
}
