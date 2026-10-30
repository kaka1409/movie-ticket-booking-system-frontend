"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../api";
import { toNotification } from "../utils/adapters";
import { NOTIFICATION_EVENT, TICKET_UPDATED_EVENT } from "../constants";
import { createNotificationSocket } from "../utils/socket";
import type { Notification, NotificationWire, NotificationMeta } from "../types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isInboxLoading: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

/**
 * Single client-side source of truth for the inbox. There is no SSR seed: the
 * root layout no longer fetches, so the inbox is read once after hydration
 * (and on every reconnect / locale change). `isInboxLoading` stays true until
 * that first read settles, so callers can render a skeleton instead of an
 * empty state. REST stays authoritative — api-contract §11.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const { locale } = useLocale();
  const { notify } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ownerRef = useRef<string | null>(null);

  useEffect(() => {
    // A different account (or a fresh login) must not inherit the previous
    // inbox — clear it and re-seed from the new session.
    if (ownerRef.current !== (user?.id ?? null)) {
      ownerRef.current = user?.id ?? null;
      setNotifications([]);
      setHasLoaded(false);
    }

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

    const handleNew = (dto: NotificationWire) => {
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
        // A failed re-read still has the pushed row to announce.
        if ("error" in result) {
          notify(pushed.title, {
            variant: pushed.type === "warning" ? "info" : pushed.type,
          });
          return;
        }
        const notification = result.data.items.find((item) => item.id === pushed.id) ?? pushed;
        if (result.data.items.length > 0) setNotifications(result.data.items);
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
        // Keep whatever is on screen: a failed resync must not empty the inbox.
        if (!cancelled && "data" in result) setNotifications(result.data.items);
        if (!cancelled) setHasLoaded(true);
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
  }, [isAuthenticated, token, locale, notify, user?.id]);

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

  // Derived gate, not a state mutation: a logout empties the inbox with no
  // clearing effect. `isLoading` keeps it open while the session restores — the
  // server has no session, so `isAuthenticated` is false during SSR and a plain
  // check would discard the seeded list and paint "No notifications yet".
  const visibleNotifications = useMemo(
    () => (isAuthenticated || isLoading ? notifications : []),
    [isAuthenticated, isLoading, notifications],
  );

  const isInboxLoading = useMemo(
    () => isLoading || (isAuthenticated && !hasLoaded),
    [isLoading, isAuthenticated, hasLoaded],
  );

  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => !item.read).length,
    [visibleNotifications],
  );

  const value = useMemo(
    () => ({ notifications: visibleNotifications, unreadCount, isInboxLoading, markRead, markAllRead }),
    [visibleNotifications, unreadCount, isInboxLoading, markRead, markAllRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
