"use client";

import Link from "next/link";
import { Mail, User } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { buildLoginUrl, buildRegisterUrl } from "@/libs/utils";

import Logo from "@/components/ui/Logo";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Tabs from "@/components/ui/Tabs";

/**
 * Mobile register form: state and submit live in `useRegisterForm` (shared with
 * the desktop skin), this file is the phone presentation.
 *
 * The tab switch and the sign-in link are real `<Link>`s carrying `returnUrl`,
 * so the page the visitor was headed for survives registering.
 */
export default function RegisterForm({ returnUrl }: { returnUrl?: string }) {
  const { translate } = useLocale();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    termsAccepted,
    toggleTermsAccepted,
    nameError,
    emailError,
    passwordError,
    confirmError,
    serverError,
    isSubmitting,
    handleSubmit,
  } = useRegisterForm({ returnUrl });

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-center mb-4">
        <Logo size="lg" />
      </div>

      <h1 className="text-center text-2xl font-extrabold text-(--color-text-primary) mb-1">
        {translate("auth.register.title")}
      </h1>
      <p className="text-center text-sm text-(--color-text-muted) mb-8">
        {translate("auth.register.subtitle")}
      </p>

      <Tabs
        tabs={[
          { key: "login", label: translate("auth.login.login_btn") },
          { key: "register", label: translate("auth.register.register_btn") },
        ]}
        activeTab="register"
        linkFor={(key) =>
          key === "login" ? buildLoginUrl(returnUrl) : buildRegisterUrl(returnUrl)
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          value={name}
          onChange={setName}
          placeholder={translate("auth.register.full_name")}
          icon={User}
          autoComplete="name"
          error={nameError}
        />

        <InputField
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={translate("auth.register.email")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={emailError}
        />

        <PasswordField
          value={password}
          onChange={setPassword}
          placeholder={translate("auth.register.password")}
          autoComplete="new-password"
          error={passwordError}
        />

        <PasswordField
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={translate("auth.register.confirm_password")}
          autoComplete="new-password"
          error={confirmError}
        />

        <TermsCheckbox
          checked={termsAccepted}
          onChange={toggleTermsAccepted}
          translate={translate}
        />

        {serverError && <ErrorAlert message={serverError} />}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {translate("auth.register.register_btn")}
        </Button>
      </form>

      <p className="text-center text-xs text-(--color-text-muted) mt-6">
        {translate("auth.register.has_account")}{" "}
        <Link
          href={buildLoginUrl(returnUrl)}
          className="text-(--color-gold) font-semibold underline underline-offset-2 hover:text-(--color-gold-light) transition-colors"
        >
          {translate("auth.register.login_link")}
        </Link>
      </p>
    </div>
  );
}
