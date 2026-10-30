"use client";

import { Mail, Lock, Smartphone, Calendar, User, ShieldCheck, Sparkles } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useLocale } from "@/contexts/LocaleContext";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import AvatarRing from "@/components/ui/AvatarRing";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";

/**
 * Desktop edit-profile view:
 * Left member profile card with gold ring identity and account verification status,
 * right form with native desktop date picker, helper notes, and responsive action buttons.
 */
export default function EditProfileContent() {
  const { translate } = useLocale();
  const {
    user,
    fullName,
    phone,
    dob,
    setFullName,
    setPhone,
    setDob,
    showErrors,
    errors,
    hasChanges,
    isPending,
    serverError,
    submit,
    cancel,
  } = useProfileForm();

  if (!user) return null;

  return (
    <AccountShell
      title={translate("profile.edit_profile")}
      description={translate("profile.pages.edit_desc")}
    >
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        {/* Left Side: Member Card Identity */}
        <aside>
          <div className="flex flex-col items-center rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center shadow-md">
            <AvatarRing src={user.avatarUrl} name={user.name} size="h-28 w-28" />

            <div className="mt-4">
              <p className="text-base font-extrabold text-white">{user.name}</p>
              <p className="truncate text-xs text-(--color-text-muted)">{user.email}</p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
              <ShieldCheck size={13} />
              <span>{translate("profile.active_member")}</span>
            </div>

            <div className="mt-5 w-full rounded-xl border border-(--color-border)/60 bg-(--color-surface-2)/60 p-3 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-gold) uppercase tracking-wider">
                <Sparkles size={13} />
                <span>PrimeSeat Club</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-(--color-text-muted)">
                {translate("profile.edit.photo_unavailable")}
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side: Profile Form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="min-w-0"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Full Name */}
            <FormField
              label={translate("profile.edit.full_name")}
              icon={User}
              error={showErrors ? errors.name?.[0] : undefined}
            >
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
              />
            </FormField>

            {/* Phone Number */}
            <div>
              <FormField
                label={translate("profile.edit.phone")}
                icon={Smartphone}
                error={showErrors ? errors.phone?.[0] : undefined}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
                />
              </FormField>
              <p className="mt-1.5 px-1 text-[11px] text-(--color-text-muted)">
                {translate("profile.edit.phone_hint")}
              </p>
            </div>

            {/* Date of Birth with desktop calendar picker */}
            <div>
              <FormField
                label={translate("profile.edit.dob")}
                icon={Calendar}
                error={showErrors ? errors.dob?.[0] : undefined}
              >
                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="w-full bg-transparent text-(--color-text-primary) outline-none cursor-pointer"
                />
              </FormField>
            </div>

            {/* Readonly Email */}
            <div>
              <FormField label={translate("profile.edit.email")} icon={Mail} disabled>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-transparent text-(--color-text-muted) outline-none cursor-not-allowed"
                />
                <Lock className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
              </FormField>
              <p className="mt-1.5 px-1 text-[11px] text-(--color-text-muted)">
                {translate("profile.edit.email_readonly")}
              </p>
            </div>
          </div>

          {serverError && <ErrorAlert className="mt-5" message={serverError} />}

          {/* Form Actions Footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-(--color-text-muted)">
              {hasChanges ? translate("profile.edit.unsaved") : ""}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" size="md" fullWidth={false} onClick={cancel}>
                {translate("profile.edit.cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth={false}
                disabled={!hasChanges || isPending}
                loading={isPending}
              >
                {translate("profile.edit.save")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
