"use client";

/**
 * Filter section label — the gold uppercase micro-label above every filter group
 * in both device trees, so that style has one home.
 *
 * The class string is exported for `FilterSection`, whose label sits inside a
 * `<button>`: a `<p>` is not allowed there (button takes phrasing content only),
 * so it renders a `<span>` carrying the same style.
 */
export const FILTER_LABEL_CLASS =
  "text-[10px] font-bold uppercase tracking-widest text-(--color-gold)";

export default function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className={`mb-2 ${FILTER_LABEL_CLASS}`}>{children}</p>;
}
