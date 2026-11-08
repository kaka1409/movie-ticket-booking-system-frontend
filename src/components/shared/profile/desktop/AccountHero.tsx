"use client";

import { ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import AvatarRing from "@/components/ui/AvatarRing";

/**
 * Desktop profile hero header:
 * Prominently presents the member's identity, role badge,
 * and a clear logout action.
 */
export default function AccountHero() {
  const { user } = useAuth();
  const { translate } = useLocale();
  const { logout, isLoggingOut } = useLogout();

  if (!user) return null;

  const memberCode = `PS-${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-(--color-border) bg-gradient-to-r from-(--color-surface) via-(--color-surface-2) to-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <AvatarRing src={user.avatarUrl} name={user.name} size="h-20 w-20 lg:h-24 lg:w-24" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black tracking-tight text-white line-clamp-1 lg:text-2xl">
                {user.name}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-gold)/40 bg-(--color-gold)/15 px-3 py-1 text-2xs font-bold text-(--color-gold)">
                <ShieldCheck size={13} />
                <span>
                  {translate(user.role === "ADMIN" ? "profile.role_admin" : "profile.member")}
                </span>
              </span>
            </div>

            <p className="mt-1 text-xs text-(--color-text-muted) lg:text-sm">{user.email}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-(--color-text-muted)">
              <span className="font-mono font-semibold text-(--color-gold-light)">
                #{memberCode}
              </span>
              <span>•</span>
              <span>{translate("profile.cinema_brand")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:border-red-500 hover:bg-red-500/20 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span>{translate("profile.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
