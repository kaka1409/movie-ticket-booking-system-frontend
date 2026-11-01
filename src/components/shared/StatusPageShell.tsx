import type { ReactNode } from "react";

/**
 * Chrome-less page frame shared by the 404 and error screens: a centred column
 * on mobile, a message + actions split from `md:` up. Neither page renders
 * inside a device layout and neither owns a side effect, so one responsive tree
 * is enough (no double mount).
 */
export default function StatusPageShell({
  children,
  aside,
  layout = aside ? "split" : "centered",
}: {
  children: ReactNode;
  /** Desktop-only actions panel — hidden below `md:`. */
  aside?: ReactNode;
  /** Layout mode: split (2-column from md:) or centered (single centered container). */
  layout?: "split" | "centered";
}) {
  const containerClasses =
    layout === "centered"
      ? "mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center px-6 py-12 md:py-16 lg:px-8"
      : "mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-16 md:grid md:grid-cols-[minmax(0,1fr)_360px] md:items-center md:gap-16 md:px-8 md:py-24";

  return (
    <div className="min-h-dvh bg-(--color-bg)">
      <div className={containerClasses}>
        {layout === "centered" ? (
          <div className="flex w-full flex-col items-center justify-center">{children}</div>
        ) : (
          <>
            <div className="flex w-full flex-col items-center md:items-start">{children}</div>
            {aside ? <div className="hidden w-full md:block">{aside}</div> : null}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Raised action panel: a `.surface-raised` wrapper so the card inside paints
 * `--color-surface-2` while any nested tile stays on `--color-bg`.
 */
export function StatusPanel({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="surface-raised">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-(--color-text-muted)">
          {title}
        </p>
        <div className="mt-4 flex flex-col gap-2">{children}</div>
        {footer ? (
          <div className="mt-5 border-t border-(--color-border) pt-4 text-xs leading-relaxed text-(--color-text-muted)">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
