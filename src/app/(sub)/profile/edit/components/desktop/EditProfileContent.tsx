"use client";

import { Mail, Lock, Smartphone, Calendar, User, Info } from "lucide-react";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useLocale } from "@/contexts/LocaleContext";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";

/**
 * Desktop edit-profile view:
 * Clean, centered two-column form grid for updating personal details,
 * email verification status, and responsive save/cancel actions.
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
      <section className="mx-auto max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
        <div className="mb-6 border-b border-(--color-border)/50 pb-4">
          <h2 className="text-lg font-black tracking-tight text-white lg:text-xl">
            {translate("profile.personal_info")}
          </h2>
          <p className="mt-1 text-xs text-(--color-text-muted) lg:text-sm">
            {translate("profile.pages.edit_desc")}
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="min-w-0"
        >
          <div className="grid gap-6 sm:grid-cols-2">
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
              <p className="mt-1.5 px-1 text-3xs text-(--color-text-muted)">
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
                  className="w-full cursor-pointer bg-transparent text-(--color-text-primary) outline-none"
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
                  className="w-full cursor-not-allowed bg-transparent text-(--color-text-muted) outline-none"
                />
                <Lock className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
              </FormField>
              <p className="mt-1.5 px-1 text-3xs text-(--color-text-muted)">
                {translate("profile.edit.email_readonly")}
              </p>
            </div>
          </div>

          {/* Photo Note */}
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-(--color-border)/60 bg-(--color-surface-2)/60 px-4 py-3 text-xs text-(--color-text-muted)">
            <Info size={15} className="shrink-0 text-(--color-gold)" />
            <span>{translate("profile.edit.photo_unavailable")}</span>
          </div>

          {serverError && <ErrorAlert className="mt-5" message={serverError} />}

          {/* Form Actions Footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-(--color-border) pt-6 sm:flex-row sm:items-center sm:justify-between">
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
      </section>
    </AccountShell>
  );
}
