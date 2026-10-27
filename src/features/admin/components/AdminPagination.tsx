"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Pager for console tables. Two drivers, one look: `onPageChange` for lists
 * held in memory, `hrefFor` for server-paginated lists whose page lives in the
 * URL. `hrefFor` wins when both are passed.
 */
export default function AdminPagination({
  page,
  totalPages,
  onPageChange,
  hrefFor,
  disabled = false,
}: {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  hrefFor?: (page: number) => string;
  /** Blocks both controls while a mutation/pending navigation is in flight. */
  disabled?: boolean;
}) {
  const { translate } = useLocale();

  if (totalPages <= 1) return null;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const isBlocked = (target: number) => disabled || target < 1 || target > totalPages;

  const controls = [
    { target: page - 1, labelKey: "admin.common.previous", Icon: ChevronLeft, isDisabled: isFirst },
    { target: page + 1, labelKey: "admin.common.next", Icon: ChevronRight, isDisabled: isLast },
  ];

  return (
    <nav
      aria-label={translate("admin.common.pagination")}
      className="mt-3 flex items-center justify-between gap-3"
    >
      <p className="text-[11px] font-semibold text-(--color-text-muted)">
        {translate("admin.common.page")} <span className="text-(--color-text-secondary)">{page}</span>{" "}
        / {totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        {controls.map(({ target, labelKey, Icon, isDisabled }) => {
          const className = `inline-flex h-8 items-center gap-1 rounded-xl border border-(--color-border) px-2.5 text-[11px] font-bold tracking-wider uppercase transition-colors ${
            isBlocked(target) || isDisabled
              ? "pointer-events-none opacity-40"
              : "cursor-pointer text-(--color-text-secondary) hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)"
          }`;
          const label = translate(labelKey);

          if (hrefFor) {
            return (
              <Link
                key={target}
                href={hrefFor(target)}
                aria-disabled={isBlocked(target) || isDisabled}
                tabIndex={isBlocked(target) || isDisabled ? -1 : undefined}
                className={`${className} no-underline`}
              >
                <Icon size={13} aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          }

          return (
            <button
              key={target}
              type="button"
              onClick={() => onPageChange?.(target)}
              disabled={isBlocked(target) || isDisabled}
              aria-label={label}
              className={className}
            >
              <Icon size={13} aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
