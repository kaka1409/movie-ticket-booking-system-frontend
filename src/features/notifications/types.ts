export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * Exact `GET /api/v1/notifications` wire row (api-contract §10) — also the
 * `notification:new` Socket.IO payload (api-contract §11).
 */
export interface NotificationWire {
  id: string;
  type: string;
  title: string;
  message: string | null;
  href: string | null;
  actionLabel: string | null;
  isRead: boolean;
  meta: unknown;
  createdAt: string;
}

/** Inbox view model the UI consumes (adapted from {@link NotificationWire}). */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  action?: { label: string; href: string };
  /** Structured payload ticket-scoped notices carry (drives live view refresh). */
  meta?: NotificationMeta;
}

/**
 * Narrowed form of the free-form `meta` JSON column. Today only `ticketId` is
 * meaningful: it lets an open ticket view know the notice is about its ticket.
 */
export interface NotificationMeta {
  ticketId?: string;
}

export interface NotificationsMeta {
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface NotificationsResult {
  items: Notification[];
  unreadCount: number;
}
