"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, LockKeyhole } from "lucide-react";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";
import FormActions from "./FormActions";
import { useLocale } from "@/contexts/LocaleContext";

function validate(
  current: string,
  newPass: string,
  confirm: string,
  translate: (key: string) => string,
) {
  const errors: { current?: string; newPass?: string; confirm?: string } = {};
  if (!current.trim()) errors.current = translate("profile.password.error_current_required");
  if (!newPass.trim()) {
    errors.newPass = translate("profile.password.error_new_required");
  } else if (
    newPass.length < 8 ||
    !/[A-Z]/.test(newPass) ||
    !/[0-9]/.test(newPass) ||
    !/[!@#$%^&*]/.test(newPass)
  ) {
    errors.newPass = translate("profile.password.error_new_requirements");
  }
  if (!confirm.trim()) {
    errors.confirm = translate("profile.password.error_confirm_required");
  } else if (confirm !== newPass) {
    errors.confirm = translate("profile.password.error_confirm_match");
  }
  return errors;
}

export default function PasswordForm() {
  const router = useRouter();
  const { translate } = useLocale();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const errors = validate(currentPassword, newPassword, confirmPassword, translate);
  const isValid = Object.keys(errors).length === 0;
  const showErrors = touched && !isValid;

  const handleSubmit = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
      <div className="flex flex-col gap-5">
        <PasswordField
          label={translate("profile.password.current")}
          placeholder={translate("profile.password.current_placeholder")}
          icon={Lock}
          value={currentPassword}
          onChange={setCurrentPassword}
          visible={showCurrent}
          onToggleVisible={() => setShowCurrent((v) => !v)}
          error={showErrors ? errors.current : undefined}
        />

        <PasswordField
          label={translate("profile.password.new")}
          placeholder={translate("profile.password.new_placeholder")}
          icon={KeyRound}
          value={newPassword}
          onChange={setNewPassword}
          visible={showNew}
          onToggleVisible={() => setShowNew((v) => !v)}
          error={showErrors ? errors.newPass : undefined}
        />

        <PasswordField
          label={translate("profile.password.confirm")}
          placeholder={translate("profile.password.confirm_placeholder")}
          icon={LockKeyhole}
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirm}
          onToggleVisible={() => setShowConfirm((v) => !v)}
          error={showErrors ? errors.confirm : undefined}
        />
      </div>

      <PasswordRequirements password={newPassword} />

      <FormActions
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}
