import type { ReactNode } from "react";

/**
 * Desktop page band: gold bar, 26px title, optional subtitle and a right-aligned
 * action slot. Every desktop page title goes through this component, so /movies,
 * the ticket list, the account area and the inbox cannot drift apart.
 *
 * The subtitle keeps a minimum height (as on /movies) so the band does not jump
 * when its first line of data lands.
 */
export default function DesktopPageHeader({
  title,
  subtitle,
  action,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  /** Spacing owned by the caller (the band itself carries no margin). */
  className?: string;
}) {
  return (
    <header className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
          <span
            aria-hidden
            className="inline-block h-[26px] w-1 shrink-0 rounded-sm bg-(--color-gold)"
          />
          {title}
        </h1>
        {subtitle !== undefined && (
          <p className="mt-1.5 min-h-4 text-xs text-(--color-text-muted)">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
