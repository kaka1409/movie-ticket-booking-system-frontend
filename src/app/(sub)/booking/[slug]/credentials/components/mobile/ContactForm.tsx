"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Mail } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { createContactSchema } from "@/features/booking/schema";
import FieldLabel from "./FieldLabel";
import TextInput from "./TextInput";
import PhoneField from "./PhoneField";

export default function ContactForm() {
  const { translate } = useLocale();
  const { user } = useAuth();
  const { contactName, contactEmail, contactPhone, contactCountryCode, setCredentials } =
    useBooking();

  // Prefill order: saved booking state (back-nav) > auth profile > empty.
  const [name, setName] = useState(contactName || user?.name || "");
  const [email, setEmail] = useState(contactEmail || user?.email || "");
  const [phone, setPhone] = useState(contactPhone || user?.phone || "");
  const [countryCode, setCountryCode] = useState(contactCountryCode || "+84");
  const [touched, setTouched] = useState(false);

  const schema = useMemo(() => createContactSchema(translate), [translate]);
  const result = schema.safeParse({ name, email, phone });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;
  const isValid = result.success;
  const showErrors = touched && !isValid;

  useEffect(() => {
    setCredentials(name, email, phone, countryCode);
  }, [name, email, phone, countryCode, setCredentials]);

  return (
    <section className="px-4 space-y-4">
      <h2 className="font-bold text-xl text-(--color-text-primary)">
        {translate("booking.credentials.your_details")}
      </h2>

      <div>
        <FieldLabel>{translate("booking.credentials.full_name")}</FieldLabel>
        <TextInput
          id="full-name"
          value={name}
          onChange={(v) => {
            setName(v);
            setTouched(true);
          }}
          placeholder={translate("booking.credentials.name_placeholder")}
          icon={User}
          autoComplete="name"
          error={showErrors ? errors.name?.[0] : undefined}
        />
      </div>

      <div>
        <FieldLabel>{translate("booking.credentials.email")}</FieldLabel>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setTouched(true);
          }}
          placeholder={translate("booking.credentials.email_placeholder")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={showErrors ? errors.email?.[0] : undefined}
        />
      </div>

      <div>
        <FieldLabel>{translate("booking.credentials.phone")}</FieldLabel>
        <PhoneField
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          phone={phone}
          onPhoneChange={(v) => {
            setPhone(v);
            setTouched(true);
          }}
          error={showErrors ? errors.phone?.[0] : undefined}
        />
      </div>

      <p className="text-[11px] text-(--color-text-muted) leading-relaxed">
        {translate("booking.credentials.email_notice")}
      </p>
    </section>
  );
}
