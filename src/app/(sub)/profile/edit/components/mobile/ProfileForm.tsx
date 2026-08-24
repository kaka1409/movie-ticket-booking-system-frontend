"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Smartphone, Calendar } from "lucide-react";
import AvatarEditor from "./AvatarEditor";
import FormField from "@/components/ui/FormField";
import FormActions from "@/components/ui/FormActions";
import { useLocale } from "@/contexts/LocaleContext";
import { createProfileSchema } from "@/features/profile/schema";
import type { User as UserType } from "@/features/profile/types";

export default function ProfileForm({ user }: { user: UserType }) {
  const router = useRouter();
  const { translate } = useLocale();
  const [fullName, setFullName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob);
  const [touched, setTouched] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const hasChanges =
    fullName !== user.name ||
    phone !== user.phone ||
    dob !== user.dob ||
    avatarChanged;

  const schema = useMemo(() => createProfileSchema(translate), [translate]);
  const result = schema.safeParse({ name: fullName, phone, dob });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;
  const isValid = result.success;
  const showErrors = touched && !isValid;

  const handleSave = () => {
    if (!hasChanges) return;
    if (!isValid) {
      setTouched(true);
      return;
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24">
      <AvatarEditor user={user} onAvatarChange={setAvatarChanged} />

      <div className="flex flex-col gap-5">
        <FormField
          label={translate("profile.edit.full_name")}
          icon={User}
          error={showErrors ? errors.name?.[0] : undefined}
        >
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </FormField>
      </div>

      <FormActions
        primaryLabel={translate("profile.edit.save")}
        cancelLabel={translate("profile.edit.cancel")}
        onPrimary={handleSave}
        onCancel={handleCancel}
        disabled={!hasChanges}
      />
    </main>
  );
}
