"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginForm } from "@/features/auth/context";
import { createLoginSchema } from "@/features/auth/schema";

import Logo from "@/components/ui/Logo";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";

export default function LoginForm() {
  const { translate } = useLocale();
  const { login } = useAuth();
  const {
    loginEmail: email,
    setLoginEmail: setEmail,
    loginPassword: password,
    setLoginPassword: setPassword,
    resetLoginForm,
  } = useLoginForm();
  const router = useRouter();

  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const schema = useMemo(() => createLoginSchema(translate), [translate]);
  const result = schema.safeParse({ email, password });
  const isValid = result.success;

  const emailError = touched
    ? result.success
      ? undefined
      : result.error.flatten().fieldErrors.email?.[0]
    : undefined;

  const passwordError = touched
    ? result.success
      ? undefined
      : result.error.flatten().fieldErrors.password?.[0]
    : undefined;

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    setServerError("");
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await login({ email, password });
      resetLoginForm();
      router.push("/");
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status === 401) {
        setServerError(translate("auth.login.error_invalid_credentials"));
      } else {
        setServerError(translate("auth.login.error_server"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, login, email, password, router, translate]);

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
        onTabChange={(tab) => router.push(`/${tab}`)}
      />

      <div className="mt-6 space-y-4">
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

        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-semibold">{serverError}</p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {translate("auth.login.login_btn")}
        </Button>
      </div>

      <p className="text-center text-xs text-(--color-text-muted) mt-6">
        {translate("auth.login.no_account")}{" "}
        <button
          onClick={() => router.push("/register")}
          className="text-(--color-gold) font-semibold underline underline-offset-2 hover:text-(--color-gold-light) transition-colors"
        >
          {translate("auth.login.register_link")}
        </button>
      </p>
    </div>
  );
}
