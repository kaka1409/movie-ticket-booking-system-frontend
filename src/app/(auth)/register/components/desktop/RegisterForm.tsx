"use client";

import Link from "next/link";
import { Mail, User } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { buildLoginUrl, buildRegisterUrl } from "@/libs/utils";

import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import PasswordChecklist from "@/components/ui/PasswordChecklist";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Tabs from "@/components/ui/Tabs";

/**
 * Desktop register card body — the right-hand column of the auth layout.
 *
 * Two extras over the mobile skin, both about the wider column: the password
 * rules are spelled out live under the password pair (`PasswordChecklist`,
 * which reads the same rules the schema validates with), and the switch/links
 * carry `returnUrl` so registering ends on the page the visitor wanted.
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
    <div className="animate-fade-in mx-auto w-full max-w-md lg:max-w-none">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-text-primary)">
        {translate("auth.register.title")}
      </h1>
      <p className="mt-1.5 text-sm text-(--color-text-muted)">
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
        className="mt-6"
      />

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
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

        {/* Always visible: the rules are what the visitor is writing towards, and
            hiding/showing them as they type would shift the form around. */}
        <PasswordChecklist password={password} size="sm" className="px-1" />

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

      <p className="mt-5 text-center text-xs text-(--color-text-muted)">
        {translate("auth.register.has_account")}{" "}
        <Link
          href={buildLoginUrl(returnUrl)}
          className="font-semibold text-(--color-gold) transition-colors underline underline-offset-2 hover:text-(--color-gold-light)"
        >
          {translate("auth.register.login_link")}
        </Link>
      </p>
    </div>
  );
}
