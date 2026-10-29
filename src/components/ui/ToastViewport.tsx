"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToast, type ToastVariant } from "@/contexts/ToastContext";

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const VARIANT_CONTAINER_CLASS: Record<ToastVariant, string> = {
  success: "border-(--color-info) bg-(--color-info) text-white",
  error: "border-(--color-error) bg-(--color-error) text-white",
  info: "border-(--color-info) bg-(--color-info) text-white",
};

/**
 * Fixed toast stack; mounted once in the root layout and fired through
 * `useToast().notify`. Notifications with an action button (wishlist Undo) use
 * the dedicated snackbar instead.
 */
export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 print:hidden bottom-[calc(6rem+env(safe-area-inset-bottom))] z-toast flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:top-6 md:bottom-auto md:w-[360px] md:items-stretch"
    >
      {toasts.map((toast) => {
        const Icon = VARIANT_ICON[toast.variant];
        return (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className={`pointer-events-auto flex w-full max-w-md items-center gap-2.5 rounded-2xl border px-4 py-3 text-left shadow-(--shadow-card) animate-fade-in md:max-w-none ${VARIANT_CONTAINER_CLASS[toast.variant]}`}
          >
            <Icon size={18} className="shrink-0 text-white/90" />
            <p className="min-w-0 flex-1 truncate text-sm font-medium">{toast.message}</p>
            <X size={16} className="shrink-0 text-white/80" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
