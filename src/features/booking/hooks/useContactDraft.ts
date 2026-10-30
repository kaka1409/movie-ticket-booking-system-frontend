"use client";

import { useEffect, useMemo, useState } from "react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { createContactSchema } from "@/features/booking/schema";

export type ContactField = "name" | "email" | "phone";

interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  /** Per-field message, present only once the field was edited AND is invalid. */
  errors: Partial<Record<ContactField, string>>;
  /** Whole-form validity — the credentials CTA gate. */
  isValid: boolean;
  setField: (field: ContactField, value: string) => void;
  setCountryCode: (code: string) => void;
}

/**
 * Credentials-step field controller — shared by the mobile and desktop forms.
 *
 * Owns the local field state (seeded from the saved draft, then the auth
 * profile), validates it with `createContactSchema` and mirrors every change
 * into the booking draft's contact slice. Mount it only after the session
 * restore resolved (`useAuth().isLoading === false`), otherwise the profile
 * prefill would run against an unresolved `user`.
 */
export function useContactDraft(): ContactDraft {
  const { translate } = useLocale();
  const { user } = useAuth();
  const { contactName, contactEmail, contactPhone, contactCountryCode, setCredentials } =
    useBooking();

  // Prefill priority: saved booking state (back-nav) > auth profile > empty.
  const [name, setName] = useState(contactName || user?.name || "");
  const [email, setEmail] = useState(contactEmail || user?.email || "");
  const [phone, setPhone] = useState(contactPhone || user?.phone || "");
  const [countryCode, setCountryCode] = useState(contactCountryCode || "+84");
  const [touched, setTouched] = useState<Record<ContactField, boolean>>({
    name: false,
    email: false,
    phone: false,
  });

  const schema = useMemo(() => createContactSchema(translate), [translate]);
  const parsed = schema.safeParse({ name, email, phone });

  useEffect(() => {
    setCredentials(name, email, phone, countryCode);
  }, [name, email, phone, countryCode, setCredentials]);

  const errors: Partial<Record<ContactField, string>> = {};
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const nameError = fieldErrors.name?.[0];
    const emailError = fieldErrors.email?.[0];
    const phoneError = fieldErrors.phone?.[0];

    if (touched.name && nameError) errors.name = nameError;
    if (touched.email && emailError) errors.email = emailError;
    if (touched.phone && phoneError) errors.phone = phoneError;
  }

  const setField = (field: ContactField, value: string) => {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setPhone(value);

    setTouched((previous) => ({ ...previous, [field]: true }));
  };

  return {
    name,
    email,
    phone,
    countryCode,
    errors,
    isValid: parsed.success,
    setField,
    setCountryCode,
  };
}
