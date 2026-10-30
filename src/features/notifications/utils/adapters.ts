import type { Notification, NotificationWire, NotificationMeta, NotificationType } from "../types";

const NOTIFICATION_TYPES: readonly NotificationType[] = ["success", "error", "warning", "info"];

/**
 * `meta` is free-form JSON in the DB, so narrow it at the boundary — a notice
 * without a ticket id simply never triggers a live ticket refresh.
 */
function toNotificationMeta(meta: unknown): NotificationMeta | undefined {
  if (typeof meta !== "object" || meta === null) return undefined;
  const raw = meta as Record<string, unknown>;
  const ticketId = typeof raw.ticketId === "string" ? raw.ticketId : undefined;
  return ticketId ? { ticketId } : undefined;
}

/**
 * Wire row → inbox view model. Unknown server categories degrade to `info`
 * (the DB column is a free-form string, so the FE must stay tolerant).
 */
export function toNotification(dto: NotificationWire): Notification {
  const type = NOTIFICATION_TYPES.includes(dto.type as NotificationType)
    ? (dto.type as NotificationType)
    : "info";

  return {
    id: dto.id,
    type,
    title: dto.title,
    message: dto.message ?? "",
    createdAt: dto.createdAt,
    read: dto.isRead,
    action: dto.href && dto.actionLabel ? { label: dto.actionLabel, href: dto.href } : undefined,
    meta: toNotificationMeta(dto.meta),
  };
}
