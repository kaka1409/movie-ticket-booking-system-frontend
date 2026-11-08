"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { loginAction } from "../action";
import { createLoginSchema } from "../schema";
import { fieldErrorsFromDetails } from "@/libs/api";

export interface LoginFormController {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  /** Field errors — only populated once the form has been submitted once. */
  emailError?: string;
  passwordError?: string;
  /** Server-side failure message (invalid credentials, transport error). */
  serverError: string;
  isSubmitting: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
}

/**
 * Login form logic, shared by both device skins: field state, Zod validation
 * (errors appear after the first submit, `touched`), the server-action call and
 * the post-login redirect. The skins only render the controls.
 *
 * `returnUrl` is the already-sanitized post-login target (`undefined` = home).
 */
export function useLoginForm({ returnUrl }: { returnUrl?: string } = {}): LoginFormController {
  const { translate } = useLocale();
  const { setAuth } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const schema = useMemo(() => createLoginSchema(translate), [translate]);
  const validation = schema.safeParse({ email, password });
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
        const loginResult = await loginAction(
          { success: false, error: "" },
          { email: email.trim(), password },
        );
        if (loginResult.success) {
          setAuth(loginResult.data.user, loginResult.data.accessToken);
          router.push(returnUrl ?? "/");
        } else if (loginResult.code === "INVALID_CREDENTIALS") {
          setServerError(translate("auth.login.error_invalid_credentials"));
        } else if (loginResult.code === "ACCOUNT_BANNED") {
          setServerError(translate("auth.login.error_account_banned"));
        } else if (loginResult.code === "VALIDATION_ERROR") {
          setServerFieldErrors(fieldErrorsFromDetails(loginResult.details));
          if (!loginResult.details?.length) setServerError(loginResult.error);
        } else {
          setServerError(translate("auth.login.error_server"));
        }
      } catch {
        setServerError(translate("auth.login.error_server"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [isValid, setAuth, email, password, router, translate, returnUrl],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError: touched ? (serverFieldErrors.email ?? fieldErrors.email?.[0]) : undefined,
    passwordError: touched ? (serverFieldErrors.password ?? fieldErrors.password?.[0]) : undefined,
    serverError,
    isSubmitting,
    handleSubmit,
  };
}
