"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { buildLoginUrl, buildRegisterUrl } from "@/libs/utils";

import Logo from "@/components/ui/Logo";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Tabs from "@/components/ui/Tabs";

/**
 * Mobile login form: state and submit live in `useLoginForm` (shared with the
 * desktop skin), this file is the phone presentation — centred logo, heading,
 * stacked fields.
 *
 * The tab switch and the register link are real `<Link>`s carrying `returnUrl`,
 * so the post-login target survives a detour through the register page.
 */
export default function LoginForm({ returnUrl }: { returnUrl?: string }) {
  const { translate } = useLocale();
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    serverError,
    isSubmitting,
    handleSubmit,
  } = useLoginForm({ returnUrl });

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-center mb-4">
        <Logo size="lg" />
      </div>

      <h1 className="text-center text-2xl font-extrabold text-(--color-text-primary) mb-1">
        {translate("auth.login.title")}
      </h1>
      <p className="text-center text-sm text-(--color-text-muted) mb-8">
        {translate("auth.login.subtitle")}
      </p>

      <Tabs
        tabs={[
          { key: "login", label: translate("auth.login.login_btn") },
          { key: "register", label: translate("auth.register.register_btn") },
        ]}
        activeTab="login"
        linkFor={(key) =>
          key === "login" ? buildLoginUrl(returnUrl) : buildRegisterUrl(returnUrl)
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={translate("auth.login.email")}
          icon={Mail}
          autoComplete="email"
          inputMode="email"
          error={emailError}
        />

        <div>
          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder={translate("auth.login.password")}
            autoComplete="current-password"
            error={passwordError}
          />
          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-(--color-gold) hover:text-(--color-gold-light) transition-colors underline underline-offset-2"
            >
              {translate("auth.login.forgot")}
            </Link>
          </div>
        </div>

        {serverError && <ErrorAlert message={serverError} />}

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
          {translate("auth.login.login_btn")}
        </Button>
      </form>

      <p className="text-center text-xs text-(--color-text-muted) mt-6">
        {translate("auth.login.no_account")}{" "}
        <Link
          href={buildRegisterUrl(returnUrl)}
          className="text-(--color-gold) font-semibold underline underline-offset-2 hover:text-(--color-gold-light) transition-colors"
        >
          {translate("auth.login.register_link")}
        </Link>
      </p>
    </div>
  );
}
