"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Windowed page list: first, last, current ±1, ellipsis in the gaps. Shown
 * whole when the range is small enough that ellipsis would only add noise.
 */
function pageWindow(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("ellipsis");
  for (let target = start; target <= end; target += 1) items.push(target);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

const CONTROL_CLASS =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-xl border border-(--color-border) px-2 text-[11px] font-bold transition-colors";
const IDLE_CLASS =
  "text-(--color-text-secondary) hover:border-(--color-gold)/40 hover:text-(--admin-accent-ink)";
const ACTIVE_CLASS = "border-(--color-gold)/60 bg-(--color-gold)/15 text-(--color-gold)";
const BLOCKED_CLASS = "pointer-events-none opacity-40";

/**
 * Pager for console tables — centred: arrow, windowed page numbers, arrow.
 * Two drivers, one look: `onPageChange` for lists held in memory, `hrefFor`
 * for server-paginated lists whose page lives in the URL. `hrefFor` wins when
 * both are passed.
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

  const isBlocked = (target: number) => disabled || target < 1 || target > totalPages;

  const renderControl = (
    target: number,
    label: string,
    content: ReactNode,
    className: string,
  ) => {
    const blocked = isBlocked(target);

    if (hrefFor) {
      return (
        <Link
          key={target}
          href={hrefFor(target)}
          aria-label={label}
          aria-disabled={blocked}
          aria-current={target === page ? "page" : undefined}
          tabIndex={blocked ? -1 : undefined}
          className={`${CONTROL_CLASS} ${className} ${blocked ? BLOCKED_CLASS : ""} no-underline`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={target}
        type="button"
        onClick={() => onPageChange?.(target)}
        disabled={blocked}
        aria-label={label}
        aria-current={target === page ? "page" : undefined}
        className={`${CONTROL_CLASS} ${className} ${blocked ? BLOCKED_CLASS : ""}`}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      aria-label={translate("admin.common.pagination")}
      className="mt-3 flex items-center justify-center gap-1"
    >
      {renderControl(
        page - 1,
        translate("admin.common.previous"),
        <ChevronLeft size={15} aria-hidden />,
        IDLE_CLASS,
      )}

      {pageWindow(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="px-1 text-[11px] font-bold text-(--color-text-muted)"
          >
            …
          </span>
        ) : (
          renderControl(item, String(item), item, item === page ? ACTIVE_CLASS : IDLE_CLASS)
        ),
      )}

      {renderControl(
        page + 1,
        translate("admin.common.next"),
        <ChevronRight size={15} aria-hidden />,
        IDLE_CLASS,
      )}
    </nav>
  );
}
