"use client";

import { Bell } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useNotifications } from "@/features/notifications/context";
import NotificationCard from "./NotificationCard";

export default function NotificationList() {
  const { translate } = useLocale();
  const { notifications, unreadCount, isInboxLoading, markRead, markAllRead } = useNotifications();

  return (
    <div className="flex flex-col">
      {unreadCount > 0 && (
        <div className="px-4 pt-3 pb-1 flex justify-end">
          <button
            type="button"
            onClick={markAllRead}
            className="text-[11px] font-semibold text-(--color-gold) underline underline-offset-2"
          >
            {translate("notif.mark_all_read")} ({unreadCount})
          </button>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={markRead}
          />
        ))}

        {notifications.length === 0 && !isInboxLoading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Bell size={40} className="text-(--color-border)" />
            <p className="text-(--color-text-muted) text-sm">
              {translate("notif.no_notifications")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
