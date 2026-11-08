"use client";

import Link from "next/link";
import { Crown, Sparkles, ShieldCheck, UserCog, LockKeyhole } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import AvatarRing from "@/components/ui/AvatarRing";
import type { User } from "@/features/auth/types";

/**
 * High-end VIP cinema membership pass card for desktop profile:
 * Displays user identity with golden accents, unique member code, active status badge,
 * and quick access buttons to profile settings.
 */
export default function MemberCard({ user }: { user: User }) {
  const { translate } = useLocale();
  const memberCode = `PS-${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-(--color-gold)/30 bg-gradient-to-br from-(--color-surface) via-(--color-surface-2) to-(--color-surface) p-6 shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-(--color-gold)/10 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-6 text-white/5">
        <Crown size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <AvatarRing src={user.avatarUrl} name={user.name} size="h-20 w-20" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-(--color-gold)/20 text-(--color-gold)">
                <Sparkles size={12} />
              </span>
              <p className="text-[11px] font-black tracking-widest text-(--color-gold) uppercase">
                {translate("profile.member_card_title")}
              </p>
            </div>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-white line-clamp-1">
              {user.name}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-(--color-text-muted)">
              <span>{user.email}</span>
              <span className="text-(--color-border)">•</span>
              <span className="flex items-center gap-1 font-mono font-semibold text-(--color-gold-light)">
                {translate("profile.member_id")}: #{memberCode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck size={14} />
            <span>{translate("profile.active_member")}</span>
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-bold text-(--color-text-secondary) transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
            >
              <UserCog size={14} />
              <span>{translate("profile.edit_profile")}</span>
            </Link>

            <Link
              href="/profile/password"
              className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-bold text-(--color-text-secondary) transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
            >
              <LockKeyhole size={14} />
              <span>{translate("profile.change_password")}</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
