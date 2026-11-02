import { PRESS_CLASS } from "@/libs/press";

/**
 * Header press feedback — the platform-chrome feel (YouTube/Facebook): a control
 * that does not sink on press reads as static next to the rest of the row.
 * Re-exported from `libs/press` so the header, the UI primitives and the route
 * cards all share one scale (see that file for the size ladder).
 */
export const HEADER_PRESS_CLASS = PRESS_CLASS;

/**
 * Shape of a header action tile (bell, locale, avatar chip). Carries no
 * background on purpose: the open state re-paints it gold-tinted, and two
 * `bg-*` utilities on one element resolve by stylesheet order, not by the
 * order they appear in the class string.
 */
export const HEADER_TILE_CLASS =
  "flex h-9 items-center justify-center rounded-(--radius-pill) border border-(--color-border)";
