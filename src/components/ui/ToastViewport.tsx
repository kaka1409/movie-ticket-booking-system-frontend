"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToast, type ToastVariant } from "@/contexts/ToastContext";

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const VARIANT_ICON_CLASS: Record<ToastVariant, string> = {
  success: "text-(--color-info)",
  error: "text-(--color-error)",
  info: "text-(--color-info)",
};

const VARIANT_CONTAINER_CLASS: Record<ToastVariant, string> = {
  success: "border-(--color-info) bg-(--color-info-bg) text-(--color-info-text)",
  error: "border-(--color-error) bg-(--color-error-bg) text-(--color-error-text)",
  info: "border-(--color-info) bg-(--color-info-bg) text-(--color-info-text)",
};

/**
 * Fixed toast stack; mounted once in the root layout and fired through
 * `useToast().notify`. Notifications with an action button (wishlist Undo) use
 * the dedicated snackbar instead.
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
            className={`pointer-events-auto flex w-full max-w-md items-center gap-2.5 rounded-2xl border px-4 py-3 text-left shadow-[--shadow-card] animate-fade-in ${VARIANT_CONTAINER_CLASS[toast.variant]}`}
          >
            <Icon size={18} className={`shrink-0 ${VARIANT_ICON_CLASS[toast.variant]}`} />
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{toast.message}</p>
          </button>
        );
      })}
    </div>
  );
}
