/** Canonical seat-type vocabulary shared by the admin diagram and editor. */
export type AdminSeatKind = "available" | "vip" | "sweetbox";

const KIND_FROM_TYPE_NAME: Record<string, AdminSeatKind> = {
  standard: "available",
  vip: "vip",
  sweetbox: "sweetbox",
};

/** Maps a seat-type name (`Standard`/`VIP`/`SweetBox`) to its public kind. */
export function seatKindOfTypeName(name: string): AdminSeatKind {
  return KIND_FROM_TYPE_NAME[name.trim().toLowerCase()] ?? "available";
}

/** Full cell paint for the read-only diagram (size included) — matches booking desktop `xl`. */
export const ADMIN_SEAT_KIND_CELL_CLASS: Record<AdminSeatKind, string> = {
  available:
    "h-14 w-14 rounded-sm border border-(--color-border) bg-(--color-surface-2) text-[11px] font-bold text-(--color-text-secondary)",
  vip: "h-14 w-14 rounded-sm bg-amber-700 text-[11px] font-bold text-white",
  sweetbox: "h-14 w-32 rounded-sm bg-pink-500 text-[11px] font-bold tracking-wide text-white",
};

/** Colour-only swatch for legends and brush pickers. */
export const ADMIN_SEAT_KIND_SWATCH_CLASS: Record<AdminSeatKind, string> = {
  available: "border border-(--color-border) bg-(--color-surface-2)",
  vip: "bg-amber-700",
  sweetbox: "bg-pink-500",
};

/** Square fill for grid-painter cells — same kind colours, fixed geometry. */
export const ADMIN_SEAT_KIND_GRID_CLASS: Record<AdminSeatKind, string> = {
  available:
    "h-11 w-11 rounded-sm border border-(--color-border) bg-(--color-surface-2) text-[11px] font-bold text-(--color-text-secondary)",
  vip: "h-11 w-11 rounded-sm bg-amber-700 text-[11px] font-bold text-white",
  sweetbox: "h-11 w-11 rounded-sm bg-pink-500 text-[11px] font-bold text-white",
};

/** Empty placeholder for the grid painter — smaller cells than the segment editor. */
export const ADMIN_EDITOR_GRID_EMPTY_CLASS =
  "h-11 w-11 rounded-sm border border-dashed border-(--color-border) text-[11px] font-bold text-(--color-text-muted) hover:border-(--color-border-strong)";
