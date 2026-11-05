"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { createProfileSchema } from "@/features/profile/schema";
import { updateProfileAction } from "@/features/profile/action";
import { toDateInputValue } from "@/libs/date";

/**
 * Device-agnostic controller for the edit-profile form. Both the mobile and the
 * desktop skins read this hook; only the presentation differs.
 */
export function useProfileForm() {
  const router = useRouter();
  const { translate } = useLocale();
  const { user, token, updateUser } = useAuth();
  const { notify } = useToast();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [dob, setDob] = useState(toDateInputValue(user?.dob));
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState("");

  const [isPending, startTransition] = useTransition();

  const hasChanges =
    fullName !== (user?.name ?? "") ||
    phone !== (user?.phone ?? "") ||
    dob !== toDateInputValue(user?.dob);

  const schema = useMemo(() => createProfileSchema(translate), [translate]);
  const result = schema.safeParse({ name: fullName, phone, dob });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;
  const isValid = result.success;
  const showErrors = touched && !isValid;

  const submit = useCallback(() => {
    if (!hasChanges) return;
    if (!isValid) {
      setTouched(true);
      return;
    }

    setServerError("");
    startTransition(async () => {
      const state = await updateProfileAction(
        { success: false, error: "" },
        { fullname: fullName, phone, dob, token: token ?? "" },
      );

      if (state.success) {
        updateUser({
          name: state.data.name,
          phone: state.data.phone,
          dob: state.data.dob,
        });
        notify(translate("profile.edit.saved"), { variant: "success" });
        router.replace("/profile");
      } else {
        if (state.status === 409) {
          setServerError(translate("profile.edit.error_conflict"));
          notify(translate("profile.edit.error_conflict"), { variant: "error" });
        } else {
          setServerError(translate("profile.edit.error_server"));
          notify(translate("profile.edit.error_server"), { variant: "error" });
        }
      }
    });
  }, [hasChanges, isValid, fullName, phone, dob, token, updateUser, router, translate, notify]);

  const cancel = useCallback(() => {
    router.replace("/profile");
  }, [router]);

  return {
    user,
    fullName,
    phone,
    dob,
    setFullName,
    setPhone,
    setDob,
    touched,
    setTouched,
    showErrors,
    errors,
    isValid,
    hasChanges,
    isPending,
    serverError,
    submit,
    cancel,
  };
}
