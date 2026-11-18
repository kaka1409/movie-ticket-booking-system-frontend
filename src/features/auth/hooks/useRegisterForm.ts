"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useToast } from "@/contexts/ToastContext";
import { buildLoginUrl } from "../utils";
import { registerAction } from "../action";
import { createRegisterSchema } from "../schema";
import { fieldErrorsFromDetails } from "@/libs/api-contract";

export interface RegisterFormController {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  termsAccepted: boolean;
  toggleTermsAccepted: () => void;
  /** Field errors — only populated once the form has been submitted once. */
  nameError?: string;
  emailError?: string;
  phoneError?: string;
  passwordError?: string;
  confirmError?: string;
  /** Shown after a submit attempt that left the terms box unticked. */
  termsError?: string;
  /** Server-side failure message (email taken, transport error). */
  serverError: string;
  isSubmitting: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
}

/**
 * Register form logic, shared by both device skins: field state, Zod
 * validation, the server-action call and the post-register navigation.
 *
 * `POST /auth/register` only answers with a message and no session, so a
 * successful submit lands on the login page with `returnUrl` preserved —
 * the visitor signs in explicitly before reaching the target.
 */
export function useRegisterForm({
  returnUrl,
}: { returnUrl?: string } = {}): RegisterFormController {
  const { translate } = useLocale();
  const { notify } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const schema = useMemo(() => createRegisterSchema(translate), [translate]);
  const validation = schema.safeParse({ name, email, phone, password, confirmPassword });
  const isValid = validation.success;
  const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setTouched(true);
      setServerError("");
      setServerFieldErrors({});
      if (!isValid || !termsAccepted) return;

      setIsSubmitting(true);
      try {
        const registerResult = await registerAction(
          { success: false, error: "" },
          { fullname: name.trim(), email: email.trim(), phone: phone.trim(), password },
        );

        if (!registerResult.success) {
          if (registerResult.code === "VALIDATION_ERROR" && registerResult.details?.length) {
            const serverErrors = fieldErrorsFromDetails(registerResult.details);
            if (serverErrors.fullname) serverErrors.name = serverErrors.fullname;
            setServerFieldErrors(serverErrors);
            return;
          }
          setServerError(
            registerResult.code === "EMAIL_EXISTS"
              ? translate("auth.register.error_email_exists")
              : translate("auth.register.error_server"),
          );
          return;
        }

        notify(translate("auth.register.success_please_login"), { variant: "success" });
        router.push(buildLoginUrl(returnUrl));
      } catch {
        setServerError(translate("auth.register.error_server"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isValid, termsAccepted, name, email, phone, password, router, notify, translate, returnUrl],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    termsAccepted,
    toggleTermsAccepted: () => setTermsAccepted((accepted) => !accepted),
    nameError: touched ? (serverFieldErrors.name ?? fieldErrors.name?.[0]) : undefined,
    emailError: touched ? (serverFieldErrors.email ?? fieldErrors.email?.[0]) : undefined,
    phoneError: touched ? (serverFieldErrors.phone ?? fieldErrors.phone?.[0]) : undefined,
    passwordError: touched ? (serverFieldErrors.password ?? fieldErrors.password?.[0]) : undefined,
    confirmError: touched
      ? (serverFieldErrors.confirmPassword ?? fieldErrors.confirmPassword?.[0])
      : undefined,
    termsError:
      touched && !termsAccepted ? translate("auth.register.error_terms_required") : undefined,
    serverError,
    isSubmitting,
    handleSubmit,
  };
}
