import { apiFetch, apiMutation, withLang } from "@/libs/api";
import { toNotification } from "./adapters";
import type { Locale } from "@/contexts/LocaleContext";
import type { Notification, NotificationDto } from "./types";

interface NotificationsMeta {
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

/**
 * GET /notifications — the inbox is the REST source of truth (the socket only
 * pushes *new* rows). `cookie` is required on the server; the browser reaches
 * it same-origin through the Next rewrite.
 *
 * The rows are rendered by the backend in `locale` (the notice text is stored as
 * a code + params, not as pre-baked copy), so switching language re-reads the
 * same inbox in the new language.
 */
export async function getNotifications(
  cookie?: string,
  locale: Locale = "en",
): Promise<NotificationsResult> {
  const result = await apiFetch<NotificationDto[], NotificationsMeta>(
    withLang("/notifications?limit=50", locale),
    undefined,
    undefined,
    cookie,
  );

  if ("error" in result) return { items: [], unreadCount: 0 };

  return {
    items: result.data.map(toNotification),
    unreadCount: result.meta?.unreadCount ?? result.data.filter((dto) => !dto.isRead).length,
  };
}

/**
 * PATCH /notifications/:id/read — client-interactive (Bearer from RAM). Throws
 * on failure; the provider swallows it so an optimistic mark never breaks the UI
 * (the next REST resync reconciles).
 */
export async function markNotificationRead(id: string, token: string): Promise<void> {
  await apiMutation(`/notifications/${id}/read`, { method: "PATCH" }, token);
}

/** PATCH /notifications/read-all — client-interactive (Bearer from RAM). */
export async function markAllNotificationsRead(token: string): Promise<void> {
  await apiMutation("/notifications/read-all", { method: "PATCH" }, token);
}
