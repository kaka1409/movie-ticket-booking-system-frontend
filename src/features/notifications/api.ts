import { apiFetch, apiMutation, withLang, type ApiResponse } from "@/libs/api";
import { toNotification } from "./utils/adapters";
import type { Locale } from "@/contexts/LocaleContext";
import type {
  NotificationWire,
  NotificationsMeta,
  NotificationsResult,
} from "./types";

/**
 * GET /notifications — the inbox is the REST source of truth (the socket only
 * pushes *new* rows). `cookie` is required on the server; the browser reaches it
 * same-origin through the Next rewrite.
 *
 * The rows are rendered by the backend in `locale` (a notice is stored as a code
 * + params, not as pre-baked copy), so switching language re-reads the same inbox
 * in the new language. The union is preserved: "no notices" and "fetch failed"
 * must stay distinguishable at both call sites.
 */
export async function getNotifications(
  cookie?: string,
  locale: Locale = "en",
): Promise<ApiResponse<NotificationsResult, NotificationsMeta>> {
  const result = await apiFetch<NotificationWire[], NotificationsMeta>(
    withLang("/notifications?limit=50", locale),
    undefined,
    undefined,
    cookie,
  );

  if ("error" in result) return result;

  return {
    data: {
      items: result.data.map(toNotification),
      unreadCount: result.meta?.unreadCount ?? result.data.filter((dto) => !dto.isRead).length,
    },
    ...(result.meta ? { meta: result.meta } : {}),
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
