"use client";

import { Mail, Lock, Smartphone, Calendar, User } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useLocale } from "@/contexts/LocaleContext";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import AvatarRing from "@/components/ui/AvatarRing";
import AccountShell from "@/features/profile/components/desktop/AccountShell";

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
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        <aside>
          <div className="flex flex-col items-center rounded-xl border border-(--color-border) bg-(--color-surface) p-5 text-center">
            <AvatarRing src={user.avatarUrl} name={user.name} size="h-24 w-24" />
            <p className="mt-3 text-sm font-bold text-white">{user.name}</p>
            <p className="truncate text-[11px] text-(--color-text-muted)">{user.email}</p>
            <button
              type="button"
              disabled
              className="mt-4 w-full cursor-not-allowed rounded-xl border border-(--color-border) bg-(--color-surface-2) px-4 py-2 text-xs font-bold text-(--color-text-muted) opacity-60"
            >
              {translate("profile.edit.change_photo")}
            </button>
            <p className="mt-2 text-[11px] text-(--color-text-muted)">
              {translate("profile.edit.photo_unavailable")}
            </p>
          </div>
        </aside>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="min-w-0"
        >
          <div className="grid gap-5 lg:grid-cols-2">
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

            <FormField
              label={translate("profile.edit.dob")}
              icon={Calendar}
              error={showErrors ? errors.dob?.[0] : undefined}
            >
              <input
                type="date"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                className="w-full bg-transparent text-(--color-text-primary) outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </FormField>

            <div>
              <FormField label={translate("profile.edit.email")} icon={Mail} disabled>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-transparent text-(--color-text-muted) outline-none"
                />
                <Lock className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
              </FormField>
              <p className="mt-2 px-1 text-[11px] text-(--color-text-muted)">
                {translate("profile.edit.email_readonly")}
              </p>
            </div>
          </div>

          {serverError && <ErrorAlert className="mt-5" message={serverError} />}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-(--color-text-muted)">
              {hasChanges ? translate("profile.edit.unsaved") : ""}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" size="md" fullWidth={false} onClick={cancel}>
                {translate("profile.edit.cancel")}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth={false}
                disabled={!hasChanges || isPending}
                loading={isPending}
                onClick={submit}
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
