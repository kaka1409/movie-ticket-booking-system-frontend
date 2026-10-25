"use client";

import Link from "next/link";
import { ShieldCheck, KeyRound, ArrowRight, UserCog, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCalendarDate, toDateInputValue } from "@/libs/date";
import Button from "@/components/ui/Button";
import AccountShell from "@/features/profile/components/desktop/AccountShell";
import type { UpcomingTicket } from "@/features/tickets/types";
import MemberCard from "./MemberCard";
import NextScreeningWidget from "./NextScreeningWidget";
import AccountStats from "./AccountStats";

/**
 * Desktop profile overview content:
 * Displays VIP Member Card, Next Screening showcase, interactive activity statistics,
 * and a side-by-side Personal Information & Account Security matrix.
 */
export default function ProfileContent({
  stats,
  nextTicket,
}: {
  stats: { reviews: number | null; wishlist: number | null; tickets: number | null };
  nextTicket: UpcomingTicket | null;
}) {
  const { translate, locale } = useLocale();
  const { user } = useAuth();

  if (!user) return null;

  const personalDetails: Array<{ label: string; value: string | null; hint?: string }> = [
    { label: translate("profile.edit.full_name"), value: user.name },
    {
      label: translate("profile.edit.email"),
      value: user.email,
      hint: translate("profile.edit.email_readonly"),
    },
    { label: translate("profile.edit.phone"), value: user.phone },
    {
      label: translate("profile.edit.dob"),
      value: user.dob ? formatCalendarDate(toDateInputValue(user.dob), locale) : null,
    },
  ];

  return (
    <AccountShell
      title={translate("profile.overview")}
      description={translate("profile.pages.overview_desc")}
      action={
        <Button href="/profile/edit" size="md" fullWidth={false} icon={UserCog} iconPosition="left">
          {translate("profile.edit_profile")}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* VIP Member Card */}
        <MemberCard user={user} />

        {/* Next Screening Widget */}
        <NextScreeningWidget nextTicket={nextTicket} />

        {/* Activity Statistics Cards */}
        <AccountStats stats={stats} />

        {/* Personal Details & Security Matrix */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-(--color-border)/50 pb-3 mb-4">
              <p className="text-xs font-bold tracking-wider text-(--color-gold) uppercase">
                {translate("profile.personal_info")}
              </p>
              <Link
                href="/profile/edit"
                className="text-xs font-bold text-(--color-gold) hover:underline"
              >
                {translate("profile.edit_profile")}
              </Link>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              {personalDetails.map((detail) => (
                <div key={detail.label} className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-(--color-text-primary)">
                    {detail.value ?? (
                      <span className="font-normal text-(--color-text-muted)">
                        {translate("profile.not_set")}
                      </span>
                    )}
                  </dd>
                  {detail.hint && (
                    <p className="mt-0.5 text-[11px] text-(--color-text-muted)">{detail.hint}</p>
                  )}
                </div>
              ))}
            </dl>
          </section>

          {/* Account Security */}
          <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-(--color-border)/50 pb-3 mb-4">
                <p className="text-xs font-bold tracking-wider text-(--color-gold) uppercase">
                  {translate("profile.security_title")}
                </p>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 size={13} />
                  <span>{translate("profile.password_status")}</span>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/10 text-(--color-gold)">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {translate("profile.password_status_desc")}
                  </h4>
                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {translate("profile.security_hint")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-(--color-border)/40 flex items-center justify-between">
              <span className="text-xs text-(--color-text-muted)">
                {translate("profile.change_password")}
              </span>
              <Link
                href="/profile/password"
                className="flex items-center gap-1.5 rounded-xl border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-xs font-bold text-white transition hover:border-(--color-gold)/50 hover:text-(--color-gold) active:scale-95"
              >
                <KeyRound size={13} />
                <span>{translate("profile.update_password_cta")}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </AccountShell>
  );
}
