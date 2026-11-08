import type { AdminSidebarMode, AdminTheme } from "./types";

/** Preference cookies: server-readable, so the console paints the saved theme
 * and rail width on the first byte instead of correcting after hydration. */
export const ADMIN_THEME_COOKIE = "admin-theme";
export const ADMIN_SIDEBAR_COOKIE = "admin-sidebar";

export const DEFAULT_ADMIN_THEME: AdminTheme = "dark";
export const DEFAULT_ADMIN_SIDEBAR_MODE: AdminSidebarMode = "expanded";

/** One year — a preference, not a session. */
export const ADMIN_PREFERENCE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

export const ADMIN_SIDEBAR_EXPANDED_PX = 272;
export const ADMIN_SIDEBAR_COLLAPSED_PX = 72;

/**
 * Shared class strings. Tailwind only emits classes it can see as literals, so
 * a console-wide look has to live in strings rather than be re-typed per page —
 * one token change re-skins every form and panel.
 */
export const ADMIN_CARD_CLASS = "rounded-2xl border border-(--color-border) bg-(--color-surface)";

export const ADMIN_LABEL_CLASS =
  "text-2xs font-bold tracking-[0.16em] text-(--color-text-muted) uppercase";

/** Text inputs, selects and textareas — native controls inherit the theme. */
export const ADMIN_INPUT_CLASS =
  "w-full rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-[13px] text-(--color-text-primary) transition-colors outline-none placeholder:text-(--color-text-muted) focus:border-(--color-gold)/60 disabled:opacity-60";

/** Two-column field grid; collapses to one column under `sm`. */
export const ADMIN_FIELD_GRID_CLASS = "grid gap-3 sm:grid-cols-2";

/** Rows per page in the console tables. */
export const ADMIN_PAGE_SIZE = 10;

/**
 * Seat-type names the public seat map understands (kind + SweetBox pairing are
 * derived from `name`). Mirrors the backend's canonical set — keep in sync.
 */
export const CANONICAL_SEAT_TYPE_NAMES = ["Standard", "VIP", "SweetBox"] as const;
