"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { createPasswordSchema } from "@/features/profile/schema";
import { PASSWORD_CHANGE_ENABLED } from "@/features/profile/constants";

/**
 * Device-agnostic controller for the change-password form. The backend endpoint
 * does not exist yet, so `canSubmit` is `false` regardless of validity — the
 * form stays interactive so the checklist and inline validation still work.
 */
export function usePasswordForm() {
  const router = useRouter();
  const { translate } = useLocale();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const schema = useMemo(() => createPasswordSchema(translate), [translate]);
  const result = schema.safeParse({
    current: currentPassword,
    newPass: newPassword,
    confirm: confirmPassword,
  });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;
  const isValid = result.success;
  const showErrors = touched && !isValid;

  const canSubmit = PASSWORD_CHANGE_ENABLED && isValid;

  const submit = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    // No backend endpoint yet — see PASSWORD_CHANGE_ENABLED.
  };

  const cancel = () => {
    router.replace("/profile");
  };

  const touch = () => setTouched(true);

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrent,
    showNew,
    showConfirm,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setShowCurrent,
    setShowNew,
    setShowConfirm,
    touched,
    showErrors,
    errors,
    isValid,
    canSubmit,
    submit,
    cancel,
    touch,
  };
}
