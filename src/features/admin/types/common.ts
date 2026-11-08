import type { ActionFailure } from "@/libs/api";

/** `admin-theme` cookie value: an explicit pick, or `system` to follow the OS. */
export type AdminTheme = "dark" | "light" | "system";

/** `admin-sidebar` cookie value — the rail width from `md:` up. */
export type AdminSidebarMode = "expanded" | "collapsed";

/**
 * Result of every console write. Actions never throw: a rejected delete, a 409
 * `IN_USE` and a dropped connection all arrive as `{ success: false }` with the
 * backend's own message, which is what the dialogs render.
 */
export type AdminActionResult<TData = null> = { success: true; data: TData } | ActionFailure;

/** Pager envelope shared by every backend-paginated admin read. */
export interface AdminPaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export type AdminBookingStatus = "pending" | "paid" | "expired" | "cancelled";

export type AdminPaymentStatus = "pending" | "success" | "failed" | "expired";

export type AdminPaymentMethodCode = "vnpay" | "momo" | "simulated";

export type AdminTicketStatus = "active" | "used" | "expired" | "cancelled" | "refunded";

