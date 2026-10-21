import { Ticket, AlertCircle, Bell, Star } from "lucide-react";
import type { NotificationType } from "./types";

/** Socket.IO event the backend gateway pushes on every new notification (§11). */
export const NOTIFICATION_EVENT = "notification:new";

/**
 * Window event the notification provider fires when a push concerns a ticket —
 * an open ticket view revalidates on it (`TICKET_UPDATED_EVENT`). `detail` is
 * `{ ticketId? }`; a missing id means "unknown ticket, listen anyway".
 */
export const TICKET_UPDATED_EVENT = "primseat:ticket-updated";

export const TYPE_CONFIG: Record<
  NotificationType,
  {
    iconBg: string;
    iconColor: string;
    dot: string;
    border: string;
    Icon: React.ElementType;
    actionBg: string;
    actionText: string;
    actionBorder: string;
    actionHover: string;
  }
> = {
  success: {
    iconBg: "bg-green-900/60",
    iconColor: "text-green-400",
    dot: "bg-green-400",
    border: "border-green-900/40",
    Icon: Ticket,
    actionBg: "bg-green-400/20",
    actionText: "text-green-300",
    actionBorder: "border-green-400/30",
    actionHover: "hover:bg-green-400/30",
  },
  error: {
    iconBg: "bg-red-600",
    iconColor: "text-white",
    dot: "bg-red-400",
    border: "border-red-900/40",
    Icon: AlertCircle,
    actionBg: "bg-red-400/20",
    actionText: "text-red-300",
    actionBorder: "border-red-400/30",
    actionHover: "hover:bg-red-400/30",
  },
  warning: {
    iconBg: "bg-(--color-surface-2)",
    iconColor: "text-(--color-gold)",
    dot: "bg-(--color-gold)",
    border: "border-(--color-border)",
    Icon: Bell,
    actionBg: "bg-(--color-gold)/20",
    actionText: "text-(--color-gold)",
    actionBorder: "border-(--color-gold)/30",
    actionHover: "hover:bg-(--color-gold)/30",
  },
  info: {
    iconBg: "bg-(--color-surface-2)",
    iconColor: "text-(--color-gold-light)",
    dot: "",
    border: "border-transparent",
    Icon: Star,
    actionBg: "bg-(--color-gold-light)/20",
    actionText: "text-(--color-gold-light)",
    actionBorder: "border-(--color-gold-light)/30",
    actionHover: "hover:bg-(--color-gold-light)/30",
  },
};
