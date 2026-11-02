import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TicketPageMeta } from "@/features/tickets/types";

/**
 * Server-rendered pager for the tickets listing. Page state lives in the URL
 * (`?tab=&page=`) so every page is a fresh server fetch — no client slicing.
 * Renders nothing for a single page.
 */
export default function Pager({ meta, tab }: { meta: TicketPageMeta; tab: "upcoming" | "past" }) {
  if (meta.totalPages <= 1) return null;

  const href = (page: number) => `/tickets?tab=${tab}&page=${page}`;
  // Windowed numbers (at most 5) around the current page.
  const first = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
  const pages = Array.from({ length: Math.min(5, meta.totalPages) }, (_, index) => first + index);

  const buttonClass = (active: boolean, disabled = false) =>
    `flex items-center justify-center min-w-10 h-10 px-2 rounded-xl text-sm font-bold transition-colors active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) ${
      active
        ? "bg-(--color-gold) text-(--color-bg)"
        : disabled
          ? "text-(--color-text-muted) opacity-40 pointer-events-none"
          : "text-(--color-text-secondary) border border-(--color-border) hover:text-(--color-gold-light) hover:border-(--color-gold)/40"
    }`;

  return (
    <nav aria-label="Tickets pages" className="flex items-center justify-center gap-2 px-4">
      <Link
        href={href(meta.page - 1)}
        aria-label="Previous page"
        className={buttonClass(false, meta.page <= 1)}
      >
        <ChevronLeft size={16} />
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={href(page)}
          aria-label={`Page ${page}`}
          className={buttonClass(page === meta.page)}
        >
          {page}
        </Link>
      ))}
      <Link
        href={href(meta.page + 1)}
        aria-label="Next page"
        className={buttonClass(false, !meta.hasNextPage)}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
