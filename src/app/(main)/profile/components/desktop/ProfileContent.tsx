"use client";

import { Star, UserCog } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCalendarDate, toDateInputValue } from "@/libs/date";
import AvatarRing from "@/components/ui/AvatarRing";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AccountShell from "@/features/profile/components/desktop/AccountShell";
import AccountStats from "./AccountStats";

export default function ProfileContent({
  stats,
}: {
  stats: { reviews: number | null; wishlist: number | null; tickets: number | null };
}) {
  const { translate, locale } = useLocale();
  const { user } = useAuth();

  if (!user) return null;

  const details: Array<{ label: string; value: string | null; hint?: string }> = [
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <AvatarRing src={user.avatarUrl} name={user.name} size="h-24 w-24" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-2xl font-black tracking-tight text-white">{user.name}</h2>
            <Badge variant="gold" size="xs" icon={Star}>
              {translate("profile.member")}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-(--color-text-muted)">{user.email}</p>
        </div>
      </div>

      <AccountStats stats={stats} />

      <div className="mt-6 rounded-xl border border-(--color-border) bg-(--color-surface) p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-text-muted)">
          {translate("profile.account_details")}
        </p>
        <dl className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-muted)">
                {detail.label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-(--color-text-primary)">
                {detail.value ?? (
                  <span className="font-normal text-(--color-text-muted)">
                    {translate("profile.not_set")}
                  </span>
                )}
              </dd>
              {detail.hint && (
                <p className="mt-1 text-[11px] text-(--color-text-muted)">{detail.hint}</p>
              )}
            </div>
          ))}
        </dl>
      </div>
    </AccountShell>
  );
}
