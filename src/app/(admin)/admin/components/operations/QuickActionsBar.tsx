"use client";

import Link from "next/link";
import {
  CalendarPlus,
  Clapperboard,
  QrCode,
  Popcorn,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Launchpad shortcuts enabling fast jumps to key administrative actions.
 */
export default function QuickActionsBar() {
  const { translate } = useLocale();

  const actions = [
    {
      href: "/admin/showtimes",
      label: translate("admin.dashboard.action_create_showtime"),
      Icon: CalendarPlus,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      href: "/admin/movies",
      label: translate("admin.dashboard.action_add_movie"),
      Icon: Clapperboard,
      color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    },
    {
      href: "/admin/check-in",
      label: translate("admin.dashboard.action_checkin"),
      Icon: QrCode,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      href: "/admin/food",
      label: translate("admin.dashboard.action_manage_fnb"),
      Icon: Popcorn,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      href: "/admin/cinemas",
      label: translate("admin.dashboard.action_cinemas_rooms"),
      Icon: Building2,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      href: "/admin/users",
      label: translate("admin.dashboard.action_users_roles"),
      Icon: Users,
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  ];

  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-card)"
    >
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles size={16} className="text-(--admin-accent-ink)" aria-hidden />
        <h2 id="quick-actions-heading" className="text-sm font-bold text-(--color-text-primary)">
          {translate("admin.dashboard.quick_actions")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            prefetch={false}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2)/40 p-3 text-center no-underline transition-all hover:bg-(--color-surface-2) hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${action.color} transition-transform group-hover:scale-110`}
            >
              <action.Icon size={18} aria-hidden />
            </div>
            <span className="text-xs font-semibold text-(--color-text-primary) line-clamp-1">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
