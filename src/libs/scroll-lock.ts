/**
 * Reference-counted body scroll lock for overlays (modal, drawer, sheet).
 *
 * `overflow: hidden` on `body` alone shifts the layout by the scrollbar width
 * (the page reflows ~15px when the scrollbar disappears). We compensate with
 * `padding-right` so there is no jump; `scrollbar-gutter: stable` is deliberately
 * NOT used because it adds a permanent gutter to every page.
 *
 * Reference counting matters: nested overlays (admin drawer + AdminFormModal,
 * QuickQrModal on top of a ticket page) must release only when the LAST one
 * closes. The returned release is idempotent so React 19 StrictMode's double
 * invoke of the cleanup does not double-decrement the counter.
 */
let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") return () => {};

  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }
  };
}
