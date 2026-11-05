"use client";

import { useRef } from "react";
import { Mail, Lock, Smartphone, Calendar, User, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useLocale } from "@/contexts/LocaleContext";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import { useAvatarUpload } from "@/features/profile/hooks/useAvatarUpload";
import { DEFAULT_AVATAR_SRC } from "@/components/ui/Avatar";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";

/**
 * Desktop edit-profile view:
 * Clean, centered two-column form grid for updating personal details,
 * email verification status, and responsive save/cancel actions.
 */
export default function EditProfileContent() {
  const { translate } = useLocale();
  const profile = useProfileForm();
  const { user, fullName, phone, dob, setFullName, setPhone, setDob, showErrors, errors, hasChanges, isPending, serverError, submit, cancel } = profile;
  const { upload, remove, isPending: isAvatarPending } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  return (
    <AccountShell
      title={translate("profile.edit_profile")}
      description={translate("profile.pages.edit_desc")}
    >
      <section className="mx-auto max-w-4xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-card) lg:p-8">
        <div className="mb-6 flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-(--color-surface-2)">
            <Image
              src={user.avatarUrl || DEFAULT_AVATAR_SRC}
              alt={user.name || ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth={false}
              disabled={isAvatarPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {isAvatarPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span className="ml-2">{translate("profile.edit.change_photo")}</span>
            </Button>
            {user.avatarUrl && (
              <button
                type="button"
                disabled={isAvatarPending}
                onClick={remove}
                className="text-left text-xs font-semibold text-(--color-text-muted) underline disabled:opacity-60"
              >
                {translate("profile.edit.remove_photo")}
              </button>
            )}
          </div>
        </div>

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
