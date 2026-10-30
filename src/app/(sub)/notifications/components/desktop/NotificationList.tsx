"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useNotifications } from "@/features/notifications/contexts/NotificationsContext";
import NotificationRow from "@/components/shared/notifications/NotificationRow";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Tabs, { tabId, tabPanelId } from "@/components/ui/Tabs";
import LocaleTransition from "@/components/ui/LocaleTransition";

type InboxTab = "all" | "unread";

/** Shared by the tab buttons and the region they control (see `ui/Tabs`). */
const TABS_ID_BASE = "notifications";

/**
 * Desktop inbox: one reading column (an inbox stretched to 7xl is all
 * whitespace), header action for mark-all-read, and an All/Unread switch.
 *
 * No fetch of its own — `NotificationProvider` owns the list (SSR-seeded in the
 * root layout, kept live by the socket), so the page, the tab counts and the
 * header bell can never disagree. The switch is local state: filtering an
 * already-loaded list must not cost a navigation, and the URL would add nothing
 * a browser back button could use.
 */
export default function NotificationList() {
  const { translate } = useLocale();
  const { notifications, unreadCount, isInboxLoading, markRead, markAllRead } = useNotifications();
  const [tab, setTab] = useState<InboxTab>("all");

  const rows = useMemo(
    () =>
      tab === "unread" ? notifications.filter((notification) => !notification.read) : notifications,
    [tab, notifications],
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2.5 text-[26px] font-black tracking-tight text-white">
            <span className="inline-block h-[26px] w-1 rounded-sm bg-(--color-gold)" />
            {translate("notif.title")}
          </h1>
          <p className="mt-1.5 text-sm text-(--color-text-muted)">{translate("notif.subtitle")}</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" fullWidth={false} onClick={markAllRead}>
            {translate("notif.mark_all_read")}
          </Button>
        )}
      </header>

      <section className="mt-6 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
        <div className="surface-raised">
          <div className="px-5 pt-4">
            <Tabs
              ariaLabel={translate("notif.title")}
              idBase={TABS_ID_BASE}
              activeTab={tab}
              onTabChange={(key) => setTab(key as InboxTab)}
              stretch={false}
              tabs={[
                {
                  key: "all",
                  label: `${translate("notif.tab_all")} (${notifications.length})`,
                },
                { key: "unread", label: `${translate("notif.tab_unread")} (${unreadCount})` },
              ]}
            />
          </div>

          <div
            role="tabpanel"
            id={tabPanelId(TABS_ID_BASE, tab)}
            aria-labelledby={tabId(TABS_ID_BASE, tab)}
          >
            {isInboxLoading && rows.length === 0 ? (
              <div className="space-y-3 px-5 py-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/3 rounded-full" />
                      <Skeleton className="h-3 w-3/4 rounded-full" />
                      <Skeleton className="h-2.5 w-24 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : rows.length === 0 ? (
              <EmptyState
                icon={tab === "unread" ? CheckCheck : Bell}
                title={
                  tab === "unread"
                    ? translate("notif.empty_unread_title")
                    : translate("notif.no_notifications")
                }
                description={tab === "unread" ? translate("notif.empty_unread_desc") : undefined}
              />
            ) : (
              <LocaleTransition>
                <div className="divide-y divide-(--color-border)">
                  {rows.map((notification) => (
                    <NotificationRow
                      key={notification.id}
                      density="comfortable"
                      notification={notification}
                      onSelect={() => markRead(notification.id)}
                    />
                  ))}
                </div>
              </LocaleTransition>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
