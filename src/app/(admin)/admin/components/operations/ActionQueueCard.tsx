"use client";

import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  ListChecks,
  RotateCcw,
  ShieldBan,
  Ticket,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import type { AdminActionQueue } from "@/features/admin/types";

interface ActionQueueCardProps {
  queue: AdminActionQueue;
}

interface QueueItem {
  key: keyof Omit<AdminActionQueue, "asOf">;
  href: string;
  icon: typeof CreditCard;
  labelKey: string;
  accent: string;
}

const QUEUE_ITEMS: QueueItem[] = [
  {
    key: "pendingPayments",
    href: "/admin/transactions",
    icon: CreditCard,
    labelKey: "admin.dashboard.action_pending_payments",
    accent: "text-amber-500",
  },
  {
    key: "pendingRefunds",
    href: "/admin/transactions",
    icon: RotateCcw,
    labelKey: "admin.dashboard.action_pending_refunds",
    accent: "text-orange-500",
  },
  {
    key: "awaitingTransfers",
    href: "/admin/tickets",
    icon: Ticket,
    labelKey: "admin.dashboard.action_awaiting_transfers",
    accent: "text-sky-500",
  },
  {
    key: "deletedReviews",
    href: "/admin/reviews",
    icon: ListChecks,
    labelKey: "admin.dashboard.action_deleted_reviews",
    accent: "text-violet-500",
  },
  {
    key: "bannedUsers",
    href: "/admin/users",
    icon: ShieldBan,
    labelKey: "admin.dashboard.action_banned_users",
    accent: "text-rose-500",
  },
];

/**
 * Operator inbox: live counts of work items (stuck payments, open refunds,
 * pending transfers, moderated reviews, banned accounts), each deep-linking to
 * the console page that resolves it.
 */
export default function ActionQueueCard({ queue }: ActionQueueCardProps) {
  const { translate } = useLocale();
  const total = QUEUE_ITEMS.reduce((sum, item) => sum + queue[item.key], 0);

  return (
    <section
      aria-label={translate("admin.dashboard.action_queue_title")}
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-(--color-text-primary)">
            {translate("admin.dashboard.action_queue_title")}
          </h2>
          <p className="text-2xs text-(--color-text-muted)">
            {translate("admin.dashboard.action_queue_subtitle")}
          </p>
        </div>

        {total === 0 ? (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-3xs font-semibold text-emerald-500">
            {translate("admin.dashboard.action_queue_clear")}
          </span>
        ) : (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-3xs font-semibold text-amber-500">
            {total} {translate("admin.dashboard.action_queue_pending_suffix")}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {QUEUE_ITEMS.map((item) => {
          const count = queue[item.key];
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              className="group flex items-center gap-2.5 rounded-xl border border-(--color-border)/60 bg-(--color-surface-2)/30 px-3 py-2.5 transition-colors hover:border-(--color-gold)/40 hover:bg-(--color-surface-2)"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--color-surface) ${item.accent}`}
              >
                <Icon size={14} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-2xs text-(--color-text-muted)">
                  {translate(item.labelKey)}
                </span>
                <span className="text-sm font-bold text-(--color-text-primary)">
                  {count}
                </span>
              </span>
              <ArrowRight
                size={12}
                aria-hidden
                className="shrink-0 text-(--color-text-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--admin-accent-ink)"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
