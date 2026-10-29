"use client";

import Link from "next/link";
import { Bell, ChevronRight, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useNotifications } from "@/features/notifications/context";
import NotificationRow from "@/features/notifications/components/NotificationRow";
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
 * Desktop header inbox.
 *
 * The popup is the **quick** view: it renders the whole list in a capped,
 * scrollable panel (a "latest 5" teaser would hide notices behind an extra
 * click) and its footer hands off to `/notifications` — the page that carries
 * the All/Unread switch and the room to read a long notice. Data needs no fetch
 * of its own: `NotificationProvider` (root layout, SSR-seeded) already pushes
 * new notices in over the socket and keeps the unread count. The header carries
 * mark-all-read plus an explicit close button — the panel is tall enough that
 * clicking outside should not be the only way out.
 */
export default function NotificationBell() {
  const { translate } = useLocale();
  const { notifications, unreadCount, isInboxLoading, markRead, markAllRead } = useNotifications();

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
          {unreadCount > 0 && !isInboxLoading && <UnreadBadge count={unreadCount} />}
        </span>
      )}
    >
      {({ close }) => (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-(--color-border) px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{translate("notif.title")}</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-(--color-gold) px-1.5 py-0.5 text-2xs font-black text-black">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="cursor-pointer text-2xs font-bold tracking-widest text-(--color-gold) uppercase transition-colors hover:text-(--color-gold-light)"
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

          {isInboxLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10">
              <Bell size={28} className="text-(--color-border)" aria-hidden />
            </div>
          ) : notifications.length === 0 ? (
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

          {/* The popup is a quick view, the page is the inbox: without this the
              new screen would be reachable only by typing the URL. */}
          <Link
            href="/notifications"
            onClick={close}
            className="flex items-center justify-center gap-1.5 border-t border-(--color-border) py-2.5 text-2xs font-bold tracking-widest text-(--color-text-secondary) uppercase transition-colors hover:text-(--color-gold)"
          >
            {translate("notif.view_all")}
            <ChevronRight size={12} aria-hidden />
          </Link>
        </>
      )}
    </Dropdown>
  );
}
