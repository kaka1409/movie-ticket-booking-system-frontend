/**
 * Header press feedback — the platform-chrome feel (YouTube/Facebook): a control
 * that does not sink on press reads as static next to the rest of the row.
 * One scale for every control: a text tab and a 36px tile shrink by the same
 * amount, so a shared constant cannot drift into two different "feels".
 */
export const HEADER_PRESS_CLASS =
  "transition duration-150 ease-out active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)";

/**
 * Shape of a header action tile (bell, locale, avatar chip). Carries no
 * background on purpose: the open state re-paints it gold-tinted, and two
 * `bg-*` utilities on one element resolve by stylesheet order, not by the
 * order they appear in the class string.
 */
export const HEADER_TILE_CLASS =
  "flex h-9 items-center justify-center rounded-(--radius-pill) border border-(--color-border)";
