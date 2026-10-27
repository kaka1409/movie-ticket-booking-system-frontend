"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import ErrorAlert from "@/components/ui/ErrorAlert";
import AdminButton from "./AdminButton";

/**
 * Create/edit dialog built on the native `<dialog>`: the browser owns the focus
 * trap, the Escape key and the top-layer stacking, so there is no portal and no
 * hand-written key handling. It sits in the DOM tree, which is what lets the
 * console theme tokens reach it.
 *
 * The parent owns the submit work (`onSubmit`) and the failure text (`error`),
 * so a rejected save keeps the dialog open with the operator's input intact.
 */
export default function AdminFormModal({
  isOpen,
  onClose,
  onSubmit,
  titleKey,
  descriptionKey,
  submitLabelKey,
  error,
  isPending = false,
  size = "lg",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  titleKey: string;
  descriptionKey?: string;
  submitLabelKey: string;
  /** Server answer to render above the footer. */
  error?: string | null;
  isPending?: boolean;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}) {
  const { translate } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    if (!dialog.open) dialog.showModal();

    // The top layer does not block page scrolling by itself.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const widthClass = size === "md" ? "max-w-md" : size === "xl" ? "max-w-3xl" : "max-w-xl";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={`admin-modal m-auto w-[calc(100%-1.5rem)] ${widthClass} rounded-2xl border border-(--color-border) bg-(--color-surface) p-0 text-(--color-text-primary) shadow-(--shadow-card)`}
      onCancel={(event) => {
        // Escape must route through the parent, otherwise `isOpen` desyncs.
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (isOpen) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="flex max-h-[85dvh] flex-col"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-(--color-border) px-4 py-3">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-sm font-extrabold tracking-tight text-(--color-text-primary)"
            >
              {translate(titleKey)}
            </h2>
            {descriptionKey && (
              <p className="mt-1 text-[11px] leading-snug text-(--color-text-muted)">
                {translate(descriptionKey)}
              </p>
            )}
          </div>

          <AdminButton
            size="icon"
            variant="ghost"
            icon={X}
            label={translate("admin.common.close")}
            onClick={onClose}
          />
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3.5">{children}</div>

        <footer className="shrink-0 space-y-3 border-t border-(--color-border) px-4 py-3">
          {error && <ErrorAlert message={error} />}

          <div className="flex items-center justify-end gap-2">
            <AdminButton size="md" variant="ghost" onClick={onClose} disabled={isPending}>
              {translate("admin.common.cancel")}
            </AdminButton>
            <AdminButton size="md" type="submit" variant="primary" isLoading={isPending}>
              {translate(submitLabelKey)}
            </AdminButton>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
