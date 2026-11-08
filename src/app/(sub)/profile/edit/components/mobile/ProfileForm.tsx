"use client";

import { User, Mail, Lock, Smartphone, Calendar, AlertCircle } from "lucide-react";
import AvatarEditor from "./AvatarEditor";
import FormField from "@/components/ui/FormField";
import FormActions from "@/components/ui/FormActions";
import { useLocale } from "@/contexts/LocaleContext";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";

export default function ProfileForm() {
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
    <main className="flex-1 overflow-y-auto px-4 pb-24">
      <AvatarEditor />

      <div className="flex flex-col gap-5">
        <FormField
          label={translate("profile.edit.full_name")}
          icon={User}
          error={showErrors ? errors.name?.[0] : undefined}
        >
          <input
            type="text"
            name="fullname"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </FormField>

        <div>
          <FormField label={translate("profile.edit.email")} icon={Mail} disabled>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="w-full bg-transparent text-(--color-text-muted) outline-none"
            />
            <Lock className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
          </FormField>
          <p className="mt-2 px-1 text-sm text-(--color-text-muted)">
            {translate("profile.edit.email_readonly")}
          </p>
        </div>

        <FormField
          label={translate("profile.edit.phone")}
          icon={Smartphone}
          error={showErrors ? errors.phone?.[0] : undefined}
        >
          <input
            type="tel"
            name="phone"
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
            name="dob"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none [&::-webkit-calendar-picker-indicator]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
          />
        </FormField>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 px-4 py-3 mt-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle size={15} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-400 font-semibold">{serverError}</p>
        </div>
      )}

      <FormActions
        primaryLabel={translate("profile.edit.save")}
        cancelLabel={translate("profile.edit.cancel")}
        onPrimary={submit}
        onCancel={cancel}
        disabled={!hasChanges || isPending}
        loading={isPending}
      />
    </main>
  );
}
