"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";
import { formatRelativeTime } from "@/libs/date";
import type { Notification } from "@/features/notifications/types";
import { TYPE_CONFIG } from "@/features/notifications/constants";

export default function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const { locale } = useLocale();
  const typeConfig = TYPE_CONFIG[notification.type];
  const Icon = typeConfig.Icon;
  const time = formatRelativeTime(notification.createdAt, locale);

  return (
    <article
      className={`
        relative rounded-2xl p-4 border
        bg-(--color-surface) cursor-pointer
        transition duration-200 hover:bg-(--color-surface-2) active:scale-[0.99]
        ${typeConfig.border}
        ${notification.read ? "opacity-40" : ""}
      `}
      onClick={() => onMarkRead(notification.id)}
    >
      {!notification.read && typeConfig.dot && (
        <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${typeConfig.dot}`} />
      )}

      <div className="flex gap-3">
        <div
          className={`
            shrink-0 w-12 h-12 rounded-full
            flex items-center justify-center
            ${typeConfig.iconBg}
          `}
        >
          <Icon size={22} className={typeConfig.iconColor} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h3
            className={`font-bold text-base leading-snug mb-1 ${
              notification.type === "error" ? "text-red-400" : "text-(--color-text-primary)"
            }`}
          >
            {notification.title}
          </h3>

          <p className="text-(--color-gold-light) text-sm leading-relaxed mb-3">
            {notification.message}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold tracking-widest text-(--color-gold)">{time}</span>
            {notification.action && (
              <Link
                href={notification.action.href}
                onClick={(event) => event.stopPropagation()}
                className={`
                  ml-auto px-4 py-1.5 rounded-(--radius-md)
                  font-semibold text-[11px] cursor-pointer
                  border transition-colors
                  ${typeConfig.actionBg} ${typeConfig.actionText}
                  ${typeConfig.actionBorder} ${typeConfig.actionHover}
                `}
              >
                {notification.action.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
