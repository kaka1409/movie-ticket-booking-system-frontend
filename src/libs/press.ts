/**
 * Press feedback for the whole app, in one place.
 *
 * `components/ui` may not import `@/layouts` (layering rule R2), so the header's
 * `HEADER_PRESS_CLASS` could never be reused by `Button`, `Chip` or a card.
 * These constants are the neutral source; the header re-exports one of them, so
 * the platform-chrome feel cannot drift into six different scales again.
 *
 * A transform needs a non-inline box: put `inline-flex`/`block` on a text link
 * before adding a press class, otherwise the scale is silently ignored.
 */
const PRESS_BASE =
  "transition duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)";

/** Compact controls: icon buttons, chips, nav items, tabs, small CTAs. */
export const PRESS_CLASS = `${PRESS_BASE} active:scale-[0.95]`;

/** Medium surfaces: primary buttons, cards, list rows with their own padding. */
export const PRESS_SOFT_CLASS = `${PRESS_BASE} active:scale-[0.98]`;

/** Full-width rows and panels: any harder scale reads as a glitch. */
export const PRESS_ROW_CLASS = `${PRESS_BASE} active:scale-[0.99]`;
