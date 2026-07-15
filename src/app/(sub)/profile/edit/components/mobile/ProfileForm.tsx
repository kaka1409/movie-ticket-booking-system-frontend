"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Smartphone, Calendar } from "lucide-react";
import AvatarEditor from "./AvatarEditor";
import Field from "./Field";
import SaveActions from "./SaveActions";
import type { User as UserType } from "@/features/profile/types";

function validate(name: string, phone: string, dob: string) {
  const errors: { name?: string; phone?: string; dob?: string } = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!phone.trim()) errors.phone = "Phone number is required.";
  else if (phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number.";
  if (!dob) errors.dob = "Date of birth is required.";
  return errors;
}

export default function ProfileForm({ user }: { user: UserType }) {
  const router = useRouter();
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

  const errors = validate(fullName, phone, dob);
  const isValid = Object.keys(errors).length === 0;
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
        <Field
          label="Full Name"
          icon={User}
          error={showErrors ? errors.name : undefined}
        >
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </Field>

        <div>
          <Field label="Email Address" icon={Mail} disabled>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-transparent text-(--color-text-muted) outline-none"
            />
            <Lock className="h-4 w-4 shrink-0 text-(--color-text-muted)" />
          </Field>
          <p className="mt-2 px-1 text-sm text-(--color-text-muted)">
            Email cannot be changed.
          </p>
        </div>

        <Field
          label="Phone Number"
          icon={Smartphone}
          error={showErrors ? errors.phone : undefined}
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
          />
        </Field>

        <Field
          label="Date of Birth"
          icon={Calendar}
          error={showErrors ? errors.dob : undefined}
        >
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-transparent text-(--color-text-primary) outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </Field>
      </div>

      <SaveActions onSave={handleSave} onCancel={handleCancel} disabled={!hasChanges} />
    </main>
  );
}
