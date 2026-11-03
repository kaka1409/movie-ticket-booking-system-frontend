"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, UserCog, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useLogout } from "@/features/auth/hooks/useLogout";
import AvatarRing from "@/components/ui/AvatarRing";

/**
 * Desktop profile hero header:
 * Prominently presents the member's identity, verified status badge,
 * and quick access to edit profile and logout.
 */
export default function AccountHero() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { translate } = useLocale();
  const { logout, isLoggingOut } = useLogout();

  if (!user) return null;

  const isEditing = pathname.startsWith("/profile/edit");
  const memberCode = `PS-${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-(--color-border) bg-gradient-to-r from-(--color-surface) via-(--color-surface-2) to-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
      {/* Subtle cinema golden ambient radial glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-(--color-gold)/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Left Side: Member Identity */}
        <div className="flex items-center gap-5">
          <AvatarRing src={user.avatarUrl} name={user.name} size="h-20 w-20 lg:h-24 lg:w-24" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black tracking-tight text-white line-clamp-1 lg:text-2xl">
                {user.name}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-2xs font-bold text-emerald-400">
                <ShieldCheck size={13} />
                <span>{translate("profile.prime_member")}</span>
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

        {/* Right Side: Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          {!isEditing && (
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-4 py-2.5 text-xs font-bold text-white transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
            >
              <UserCog size={15} />
              <span>{translate("profile.edit_profile")}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-4 py-2.5 text-xs font-bold text-(--color-text-muted) transition hover:border-red-500/40 hover:text-red-400 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={15} className="animate-spin text-red-400" />
            ) : (
              <LogOut size={15} />
            )}
            <span>{translate("profile.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
