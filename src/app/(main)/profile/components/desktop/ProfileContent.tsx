"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCalendarDate, toDateInputValue } from "@/libs/date";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";

/**
 * Desktop profile overview content:
 * Displays next upcoming screening showcase, activity statistics counters,
 * and a side-by-side Personal Information & Account Security matrix —
 * all inside the shell's single full-width panel.
 */
export default function ProfileContent({
  stats,
  nextTicket,
}: {
  stats: ReactNode;
  nextTicket: ReactNode;
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
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2)/40 p-5">
          {nextTicket}
        </div>

        <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2)/40 px-5 py-4">
          {stats}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-(--color-border) bg-(--color-surface-2)/40 p-5">
            <div className="mb-4 flex items-center justify-between">
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
                  <dt className="text-2xs font-bold uppercase tracking-widest text-(--color-text-muted)">
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
                    <p className="mt-0.5 text-3xs text-(--color-text-muted)">{detail.hint}</p>
                  )}
                </div>
              ))}
            </dl>
          </section>

          <section className="flex flex-col justify-between rounded-xl border border-(--color-border) bg-(--color-surface-2)/40 p-5">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold tracking-wider text-(--color-gold) uppercase">
                  {translate("profile.security_title")}
                </p>
              </div>

              <div className="flex items-start gap-3.5">
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

            <div className="mt-6 flex items-center justify-between border-t border-(--color-border)/40 pt-4">
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
