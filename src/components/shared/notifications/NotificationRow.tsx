"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { TYPE_CONFIG } from "@/features/notifications/constants";
import type { Notification } from "@/features/notifications/types";
import { formatRelativeTime } from "@/libs/utils";

/**
 * One inbox row, shared by the header popup (`compact`) and the desktop
 * notifications page (`comfortable`) so the two can never drift apart.
 *
 * The whole row is the target: it marks the notice read and, when the notice
 * carries an action, navigates. No nested link — inside a clickable row the
 * action label is a cue, not a second control — which is also why every child
 * is a `<span>`: the root is either a `<Link>` or a `<button>`.
 *
 * A read row keeps full contrast in the comfortable density (the title drops to
 * the secondary text colour instead of dimming the whole row there); the popup
 * keeps its original `opacity-55`.
 */
export default function NotificationRow({
  notification,
  onSelect,
  density = "compact",
}: {
  notification: Notification;
  onSelect: () => void;
  density?: "compact" | "comfortable";
}) {
  const { locale } = useLocale();
  const { iconBg, iconColor, dot, Icon } = TYPE_CONFIG[notification.type];
  const isComfortable = density === "comfortable";

  const titleColor = notification.read
    ? isComfortable
      ? "text-(--color-text-secondary)"
      : "text-(--color-text-primary)"
    : notification.type === "error"
      ? "text-red-400"
      : "text-(--color-text-primary)";

  const body = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${iconBg} ${
          isComfortable ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <Icon size={isComfortable ? 18 : 16} className={iconColor} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={`truncate font-bold ${isComfortable ? "text-[15px]" : "text-[13px]"} ${titleColor}`}
          >
            {notification.title}
          </span>
          {!notification.read && dot && (
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
          )}
        </span>

        {notification.message && (
          <span
            className={`mt-0.5 block leading-relaxed text-(--color-text-muted) ${
              isComfortable ? "line-clamp-3 text-[13px]" : "line-clamp-2 text-xs"
            }`}
          >
            {notification.message}
          </span>
        )}

        <span className="mt-1.5 flex items-center gap-2">
          <span className="text-2xs font-bold tracking-widest text-(--color-gold) uppercase">
            {formatRelativeTime(notification.createdAt, locale)}
          </span>
          {notification.action && (
            <span className="ml-auto flex items-center gap-1 text-2xs font-bold tracking-wide text-(--color-text-secondary)">
              {notification.action.label}
              {isComfortable && <ChevronRight size={12} aria-hidden />}
            </span>
          )}
        </span>
      </span>
    </>
  );

  const rowClassName = isComfortable
    ? "flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-(--color-surface-2)"
    : `flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-(--color-surface-2) ${
        notification.read ? "opacity-55" : ""
      }`;

  if (notification.action) {
    return (
      <Link href={notification.action.href} onClick={onSelect} className={rowClassName}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onSelect} className={rowClassName}>
      {body}
    </button>
  );
}
