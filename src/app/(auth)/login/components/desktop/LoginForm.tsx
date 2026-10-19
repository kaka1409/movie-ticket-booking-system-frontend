"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { buildLoginUrl, buildRegisterUrl } from "@/libs/utils";

import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Tabs from "@/components/ui/Tabs";

/**
 * Desktop login card body — the right-hand column of the auth layout, which
 * already supplies the brand panel, header and footer.
 *
 * The login/register switch is a pair of real links (`ui/Tabs linkFor`), so
 * each form keeps its own URL and `returnUrl` travels between them: a visitor
 * bounced off a protected page who signs up instead still lands on it.
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
    <div className="animate-fade-in mx-auto w-full max-w-md lg:max-w-none">
      <h1 className="text-2xl font-extrabold tracking-tight text-(--color-text-primary)">
        {translate("auth.login.title")}
      </h1>
      <p className="mt-1.5 text-sm text-(--color-text-muted)">{translate("auth.login.subtitle")}</p>

      <Tabs
        tabs={[
          { key: "login", label: translate("auth.login.login_btn") },
          { key: "register", label: translate("auth.register.register_btn") },
        ]}
        activeTab="login"
        linkFor={(key) =>
          key === "login" ? buildLoginUrl(returnUrl) : buildRegisterUrl(returnUrl)
        }
        className="mt-6"
      />

      <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
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
          <div className="mt-1.5 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-(--color-gold) transition-colors underline underline-offset-2 hover:text-(--color-gold-light)"
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

      <p className="mt-5 text-center text-xs text-(--color-text-muted)">
        {translate("auth.login.no_account")}{" "}
        <Link
          href={buildRegisterUrl(returnUrl)}
          className="font-semibold text-(--color-gold) transition-colors underline underline-offset-2 hover:text-(--color-gold-light)"
        >
          {translate("auth.login.register_link")}
        </Link>
      </p>
    </div>
  );
}
