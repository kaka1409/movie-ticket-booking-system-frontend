"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { Notification } from "@/features/notifications/types";
import NotificationCard from "../shared/NotificationCard";

export default function NotificationList({
  notifications: initialNotifications,
}: {
  notifications: Notification[];
}) {
  const { translate } = useLocale();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markRead = (id: number) =>
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

  const markAllRead = () =>
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

  return (
    <div className="flex flex-col">
      {unreadCount > 0 && (
        <div className="px-4 pt-3 pb-1 flex justify-end">
          <button
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

        {notifications.length === 0 && (
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
