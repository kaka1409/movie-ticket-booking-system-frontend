"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast, type ToastVariant } from "@/contexts/ToastContext";

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const VARIANT_ICON_CLASS: Record<ToastVariant, string> = {
  success: "text-(--color-gold)",
  error: "text-red-400",
  info: "text-(--color-text-muted)",
};

/**
 * Fixed toast stack shared by every action notification (wishlist saves,
 * future booking/ticket notices). Mounted once in the root layout; actions
 * fire through `useToast().notify`. For notifications with action buttons
 * (e.g. wishlist Undo) keep the dedicated snackbar instead.
 */
export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-center gap-2"
    >
      {toasts.map((toast) => {
        const Icon = VARIANT_ICON[toast.variant];
        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className="pointer-events-auto flex w-full max-w-md items-center gap-2.5 rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-left shadow-[--shadow-card] animate-fade-in"
          >
            <Icon size={18} className={`shrink-0 ${VARIANT_ICON_CLASS[toast.variant]}`} />
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-(--color-text-primary)">
              {toast.message}
            </p>
          </button>
        );
      })}
    </div>
  );
}
