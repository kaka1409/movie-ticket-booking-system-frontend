"use client";

import { User, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useContactDraft } from "@/features/booking/hooks/useContactDraft";
import { Skeleton } from "@/components/ui/Skeleton";
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import PhoneField from "./PhoneField";

/**
 * Gates the form on the session-restore call so the account prefill runs with a
 * resolved `user` — initializing the fields inline used to leave them empty on a
 * hard refresh, because AuthContext resolves asynchronously.
 */
export default function ContactForm({ className = "px-4 space-y-4" }: { className?: string }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className={`${className}`} aria-busy="true">
        <Skeleton className="h-7 w-40 rounded-md" />
        <Skeleton className="h-13 w-full rounded-2xl" />
        <Skeleton className="h-13 w-full rounded-2xl" />
        <Skeleton className="h-13 w-full rounded-2xl" />
      </section>
    );
  }

  return <ContactFields className={className} />;
}

function ContactFields({ className }: { className: string }) {
  const { translate } = useLocale();
  const { name, email, phone, countryCode, errors, setField, setCountryCode } = useContactDraft();

  return (
    <section className={className}>
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("booking.credentials.your_details")}
      </h2>

      <div>
        <FieldLabel htmlFor="full-name">{translate("booking.credentials.full_name")}</FieldLabel>
        <TextInput
          id="full-name"
          value={name}
          maxLength={100}
          onChange={(value) => setField("name", value)}
          placeholder={translate("booking.credentials.name_placeholder")}
          icon={User}
          autoComplete="name"
          error={errors.name}
        />
      </div>

      <div>
        <FieldLabel htmlFor="email">{translate("booking.credentials.email")}</FieldLabel>
        <TextInput
          id="email"
          type="email"
          value={email}
          maxLength={254}
          onChange={(value) => setField("email", value)}
          placeholder={translate("booking.credentials.email_placeholder")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={errors.email}
        />
      </div>

      <div>
        <FieldLabel htmlFor="phone">{translate("booking.credentials.phone")}</FieldLabel>
        <PhoneField
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          phone={phone}
          onPhoneChange={(value) => setField("phone", value)}
          error={errors.phone}
        />
      </div>

      <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
        {translate("booking.credentials.email_notice")}
      </p>
    </section>
  );
}
