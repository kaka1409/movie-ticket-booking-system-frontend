"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { buildLoginUrl } from "@/libs/utils";
import { loginAction, registerAction } from "../action";
import { createRegisterSchema } from "../schema";
import { fieldErrorsFromDetails } from "@/libs/api";

export interface RegisterFormController {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  termsAccepted: boolean;
  toggleTermsAccepted: () => void;
  /** Field errors — only populated once the form has been submitted once. */
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  confirmError?: string;
  /** Server-side failure message (email taken, transport error). */
  serverError: string;
  isSubmitting: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
}

/**
 * Register form logic, shared by both device skins: field state, Zod
 * validation, the server-action call and the post-register navigation.
 *
 * Registering signs the visitor in in one go: `POST /auth/register` only
 * answers with a message and no session, so the hook then calls
 * `loginAction` with the same credentials, adopts the session and lands on
 * `returnUrl`. If that follow-up fails (the account does exist by then), it
 * falls back to the login page with the target preserved.
 */
export function useRegisterForm({
  returnUrl,
}: { returnUrl?: string } = {}): RegisterFormController {
  const { translate } = useLocale();
  const { setAuth } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const schema = useMemo(() => createRegisterSchema(translate), [translate]);
  const validation = schema.safeParse({ name, email, password, confirmPassword });
  const isValid = validation.success;
  const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setTouched(true);
      setServerError("");
      setServerFieldErrors({});
      if (!isValid) return;

      setIsSubmitting(true);
      try {
        const registerResult = await registerAction(
          { success: false, error: "" },
          { fullname: name, email, password },
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

        const session = await loginAction({ success: false, error: "" }, { email, password });
        if (session.success) {
          setAuth(session.data.user, session.data.accessToken);
          router.push(returnUrl ?? "/");
        } else {
          router.push(buildLoginUrl(returnUrl));
        }
      } catch {
        setServerError(translate("auth.register.error_server"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isValid, name, email, password, router, setAuth, translate, returnUrl],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    termsAccepted,
    toggleTermsAccepted: () => setTermsAccepted((accepted) => !accepted),
    nameError: touched ? (serverFieldErrors.name ?? fieldErrors.name?.[0]) : undefined,
    emailError: touched ? (serverFieldErrors.email ?? fieldErrors.email?.[0]) : undefined,
    passwordError: touched ? (serverFieldErrors.password ?? fieldErrors.password?.[0]) : undefined,
    confirmError: touched
      ? (serverFieldErrors.confirmPassword ?? fieldErrors.confirmPassword?.[0])
      : undefined,
    serverError,
    isSubmitting,
    handleSubmit,
  };
}
