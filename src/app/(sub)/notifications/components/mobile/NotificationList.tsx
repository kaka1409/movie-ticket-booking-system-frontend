"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { INITIAL_NOTIFS } from "@/features/notifications/mock";
import type { Notification } from "@/features/notifications/types";
import NotificationCard from "../shared/NotificationCard";

export default function NotificationList() {
  const { t } = useLocale();
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex flex-col">
      {unreadCount > 0 && (
        <div className="px-4 pt-3 pb-1 flex justify-end">
          <button
            onClick={markAllRead}
            className="text-[11px] font-semibold text-(--color-gold) underline underline-offset-2"
          >
            {t("notif.mark_all_read")} ({unreadCount})
          </button>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            onMarkRead={markRead}
          />
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Bell size={40} className="text-(--color-border)" />
            <p className="text-(--color-text-muted) text-sm">
              {t("notif.no_notifications")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
