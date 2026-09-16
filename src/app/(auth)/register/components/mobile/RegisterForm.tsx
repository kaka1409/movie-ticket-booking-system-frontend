"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterForm } from "@/features/auth/context";
import { createRegisterSchema } from "@/features/auth/schema";

import Logo from "@/components/ui/Logo";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";

export default function RegisterForm() {
  const { translate } = useLocale();
  const { register } = useAuth();
  const {
    registerName: name,
    setRegisterName: setName,
    registerEmail: email,
    setRegisterEmail: setEmail,
    registerPassword: password,
    setRegisterPassword: setPassword,
    registerConfirmPassword: confirmPassword,
    setRegisterConfirmPassword: setConfirmPassword,
    registerTerms: terms,
    setRegisterTerms: setTerms,
    resetRegisterForm,
  } = useRegisterForm();
  const router = useRouter();

  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const schema = useMemo(
    () => createRegisterSchema(translate),
    [translate],
  );
  const result = schema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    terms,
  });
  const isValid = result.success;
  const fieldErrors = result.success
    ? {}
    : result.error.flatten().fieldErrors;

  const nameError = touched ? fieldErrors.name?.[0] : undefined;
  const emailError = touched ? fieldErrors.email?.[0] : undefined;
  const passwordError = touched ? fieldErrors.password?.[0] : undefined;
  const confirmError = touched ? fieldErrors.confirmPassword?.[0] : undefined;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await register({
        fullname: name,
        email,
        password,
      });
      resetRegisterForm();
      router.push("/login");
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status === 409) {
        setServerError(translate("auth.register.error_email_exists"));
      } else {
        setServerError(translate("auth.register.error_server"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isValid,
    register,
    name,
    email,
    password,
    router,
    translate,
  ]);

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
        onTabChange={(tab) => router.push(`/${tab}`)}
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

        <div>
          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder={translate("auth.register.password")}
            autoComplete="new-password"
            error={passwordError}
          />
        </div>

        <PasswordField
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={translate("auth.register.confirm_password")}
          autoComplete="new-password"
          error={confirmError}
        />

        <TermsCheckbox
          checked={terms}
          onChange={() => setTerms(!terms)}
          translate={translate}
        />

        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-400 font-semibold">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
        >
          {translate("auth.register.register_btn")}
        </Button>
      </form>

      <p className="text-center text-xs text-(--color-text-muted) mt-6">
        {translate("auth.register.has_account")}{" "}
        <button
          onClick={() => router.push("/login")}
          className="text-(--color-gold) font-semibold underline underline-offset-2 hover:text-(--color-gold-light) transition-colors"
        >
          {translate("auth.register.login_link")}
        </button>
      </p>
    </div>
  );
}
