"use client";

import Link from "next/link";
import type { Notification } from "@/features/notifications/types";
import { TYPE_CONFIG } from "@/features/notifications/constants";

export default function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[notification.type];
  const Icon = cfg.Icon;

  return (
    <article
      className={`
        relative rounded-2xl p-4 border
        bg-(--color-surface) cursor-pointer
        transition-all duration-200 hover:bg-(--color-surface-2) active:scale-[0.99]
        ${cfg.border}
        ${notification.read ? "opacity-40" : ""}
      `}
      onClick={() => onMarkRead(notification.id)}
    >
      {!notification.read && cfg.dot && (
        <span
          className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${cfg.dot}`}
        />
      )}

      <div className="flex gap-3">
        <div
          className={`
            shrink-0 w-12 h-12 rounded-full
            flex items-center justify-center
            ${cfg.iconBg}
          `}
        >
          <Icon size={22} className={cfg.iconColor} />
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h3
            className={`font-bold text-base leading-snug mb-1 ${
              notification.type === "error"
                ? "text-red-400"
                : "text-(--color-text-primary)"
            }`}
          >
            {notification.title}
          </h3>

          <p className="text-(--color-gold-light) text-sm leading-relaxed mb-3">
            {notification.message}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-(--color-gold)">
              {notification.time}
            </span>
            {notification.action && (
              <Link
                href={notification.action.href}
                onClick={(e) => e.stopPropagation()}
                className={`
                  ml-auto px-4 py-1.5 rounded-(--radius-md)
                  font-semibold text-[11px] cursor-pointer
                  border transition-colors
                  ${cfg.actionBg} ${cfg.actionText}
                  ${cfg.actionBorder} ${cfg.actionHover}
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
