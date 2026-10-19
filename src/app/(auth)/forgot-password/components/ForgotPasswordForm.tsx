"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Mail } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

/**
 * Password-reset placeholder: the real form's shape (email + submit) with the
 * submit disabled and an honest note, because the backend endpoint does not
 * exist yet. The login form has pointed at `/forgot-password` since before the
 * route did — this turns that dead link into a page that is ready for the
 * wiring (add the action here, drop the `disabled` props).
 *
 * One body serves both device trees; the auth layouts already differ around it
 * (mobile chrome vs. the desktop shell + brand card).
 */
export default function ForgotPasswordForm() {
  const { translate } = useLocale();
  const [email, setEmail] = useState("");

  return (
    <div className="animate-fade-in mx-auto w-full max-w-md lg:max-w-none">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-text-primary)">
        {translate("auth.forgot.title")}
      </h1>
      <p className="mt-1.5 text-sm text-(--color-text-muted)">
        {translate("auth.forgot.subtitle")}
      </p>

      <div className="mt-6 space-y-4">
        <InputField
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={translate("auth.forgot.email")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
        />

        <Button type="button" variant="primary" size="lg" disabled>
          {translate("auth.forgot.submit")}
        </Button>

        <div className="flex items-start gap-2.5 rounded-xl border border-(--color-gold)/25 bg-(--color-gold)/5 px-4 py-3">
          <Info size={15} aria-hidden className="mt-0.5 shrink-0 text-(--color-gold)" />
          <p className="text-xs leading-relaxed text-(--color-text-muted)">
            {translate("auth.forgot.coming_soon")}
          </p>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-(--color-text-muted)">
        <Link
          href="/login"
          className="font-semibold text-(--color-gold) transition-colors underline underline-offset-2 hover:text-(--color-gold-light)"
        >
          {translate("auth.forgot.back_to_login")}
        </Link>
      </p>
    </div>
  );
}
