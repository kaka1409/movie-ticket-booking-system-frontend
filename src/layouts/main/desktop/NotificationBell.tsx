"use client";

import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useNotifications } from "@/features/notifications/context";
import { TYPE_CONFIG } from "@/features/notifications/constants";
import { formatRelativeTime } from "@/libs/utils";
import type { Notification } from "@/features/notifications/types";
import Dropdown from "@/components/ui/Dropdown";

/** Unread pill — widened past a single digit so two digits still fit. */
function UnreadBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}

/**
 * One row of the inbox popup.
 *
 * The whole row is the target: it marks the notice read and, when the notice
 * carries an action, navigates. No nested link — inside a clickable row the
 * action label is a cue, not a second control.
 */
function NotificationRow({
  notification,
  onSelect,
}: {
  notification: Notification;
  onSelect: () => void;
}) {
  const { locale } = useLocale();
  const { iconBg, iconColor, dot, Icon } = TYPE_CONFIG[notification.type];

  const body = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon size={16} className={iconColor} aria-hidden />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={`truncate text-[13px] font-bold ${
              notification.type === "error" ? "text-red-400" : "text-(--color-text-primary)"
            }`}
          >
            {notification.title}
          </span>
          {!notification.read && dot && (
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
          )}
        </span>

        {notification.message && (
          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-(--color-text-muted)">
            {notification.message}
          </span>
        )}

        <span className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-(--color-gold) uppercase">
            {formatRelativeTime(notification.createdAt, locale)}
          </span>
          {notification.action && (
            <span className="ml-auto text-[10px] font-bold tracking-wide text-(--color-text-secondary)">
              {notification.action.label}
            </span>
          )}
        </span>
      </span>
    </>
  );

  const rowClassName = `flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-(--color-surface-2) ${
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

/**
 * Desktop header inbox.
 *
 * The popup **is** the inbox on desktop — there is no `/notifications` screen
 * for this skin — so it renders the whole list in a capped, scrollable panel
 * rather than a "latest 5 + View all" teaser. Data needs no fetch of its own:
 * `NotificationProvider` (root layout, SSR-seeded) already pushes new notices
 * in over the socket and keeps the unread count. The header carries
 * mark-all-read plus an explicit close button — the panel is tall enough that
 * clicking outside should not be the only way out.
 */
export default function NotificationBell() {
  const { translate } = useLocale();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <Dropdown
      label={translate("layout.header.notifications")}
      panelClassName="w-[min(360px,calc(100vw-2rem))]"
      trigger={({ isOpen }) => (
        <span
          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isOpen
              ? "bg-(--color-surface-2) text-(--color-gold)"
              : "text-(--color-text-muted) hover:text-(--color-gold)"
          }`}
        >
          <Bell size={18} />
          {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
        </span>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{translate("notif.title")}</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-(--color-gold) px-1.5 py-0.5 text-[10px] font-black text-black">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="cursor-pointer text-[10px] font-bold tracking-widest text-(--color-gold) uppercase transition-colors hover:text-(--color-gold-light)"
                >
                  {translate("notif.mark_all_read")}
                </button>
              )}

              <button
                type="button"
                onClick={close}
                aria-label={translate("common.close")}
                className="-mr-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-(--color-text-muted) transition-colors duration-150 hover:bg-(--color-surface-2) hover:text-white"
              >
                <X size={14} aria-hidden />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10">
              <Bell size={28} className="text-(--color-border)" aria-hidden />
              <p className="text-xs text-(--color-text-muted)">
                {translate("notif.no_notifications")}
              </p>
            </div>
          ) : (
            <div className="scrollbar-hide max-h-[min(70vh,480px)] overflow-y-auto p-1.5">
              <div className="flex flex-col gap-0.5">
                {notifications.map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onSelect={() => markRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Dropdown>
  );
}
