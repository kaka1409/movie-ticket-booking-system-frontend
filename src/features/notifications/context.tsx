"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "./api";
import { toNotification } from "./adapters";
import { NOTIFICATION_EVENT, TICKET_UPDATED_EVENT } from "./constants";
import { createNotificationSocket } from "./socket";
import type { Notification, NotificationDto, NotificationMeta } from "./types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

/**
 * Single client-side source of truth for the inbox. The SSR seed comes from the
 * root layout (cookie fetch); after hydration the provider keeps the list live:
 * `notification:new` pushes from the Socket.IO gateway add rows, and a
 * reconnect re-fetches `/notifications` to resync anything missed offline
 * (REST stays authoritative — api-contract §11).
 *
 * The list is language-sensitive: the backend renders each notice from a code +
 * params, so it is fetched with the current locale and re-read whenever that
 * locale changes (`router.refresh()` cannot reseed this provider — its state is
 * seeded once).
 */
export function NotificationProvider({
  initialNotifications,
  children,
}: {
  initialNotifications: Notification[];
  children: ReactNode;
}) {
  const { token, isAuthenticated } = useAuth();
  const { locale } = useLocale();
  const { notify } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    let cancelled = false;
    const socket = createNotificationSocket(token);

    /**
     * Ticket-scoped notices change a ticket *someone else* may be looking at
     * (recipient accepted, sender cancelled): tell mounted views so they can
     * revalidate. No `ticketId` = scope unknown, listeners decide for themselves.
     */
    const broadcastTicketUpdate = (meta?: NotificationMeta) => {
      window.dispatchEvent(new CustomEvent(TICKET_UPDATED_EVENT, { detail: meta ?? {} }));
    };

    const handleNew = (dto: NotificationDto) => {
      const pushed = toNotification(dto);

      // Show it at once, so a slow refetch never hides a new notice...
      setNotifications((previous) =>
        previous.some((item) => item.id === pushed.id) ? previous : [pushed, ...previous],
      );
      if (pushed.meta?.ticketId) {
        broadcastTicketUpdate(pushed.meta);
      }

      // ...then re-read the inbox: the push payload is rendered in the canonical
      // locale (the server has no locale for a socket), and REST is the source
      // of truth, so the refetch both localizes the row and picks up anything
      // the socket missed. The toast is announced once, in the visitor's language.
      void getNotifications(undefined, locale).then((result) => {
        if (cancelled) return;
        const notification = result.items.find((item) => item.id === pushed.id) ?? pushed;
        if (result.items.length > 0) setNotifications(result.items);
        notify(notification.title, {
          variant: notification.type === "warning" ? "info" : notification.type,
        });
      });
    };

    // REST resync — runs once on mount (covers login without a reload), on
    // every reconnect (covers notifications missed while the socket was down)
    // and on a locale change (the effect re-runs, so the inbox re-reads in the
    // new language).
    const resync = () => {
      void getNotifications(undefined, locale).then((result) => {
        if (!cancelled) setNotifications(result.items);
      });
    };

    // Notices missed while the socket was down never reached `handleNew`, so an
    // open ticket view may be stale — nudge every listener once after a resync.
    const handleReconnect = () => {
      resync();
      broadcastTicketUpdate();
    };

    socket.on(NOTIFICATION_EVENT, handleNew);
    socket.io.on("reconnect", handleReconnect);
    resync();

    return () => {
      cancelled = true;
      socket.off(NOTIFICATION_EVENT, handleNew);
      socket.io.off("reconnect", handleReconnect);
      socket.disconnect();
    };
  }, [isAuthenticated, token, locale, notify]);

  const markRead = useCallback(
    (id: string) => {
      setNotifications((previous) =>
        previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
      if (token) void markNotificationRead(id, token).catch(() => undefined);
    },
    [token],
  );

  const markAllRead = useCallback(() => {
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
    if (token) void markAllNotificationsRead(token).catch(() => undefined);
  }, [token]);

  // Logout is a derived gate, not a mutation: a logged-out visitor sees an
  // empty inbox immediately without a state-clearing effect (the next login
  // resyncs the list through the socket effect).
  const visibleNotifications = useMemo(
    () => (isAuthenticated ? notifications : []),
    [isAuthenticated, notifications],
  );

  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => !item.read).length,
    [visibleNotifications],
  );

  const value = useMemo(
    () => ({ notifications: visibleNotifications, unreadCount, markRead, markAllRead }),
    [visibleNotifications, unreadCount, markRead, markAllRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
