"use client";

import { Lock, KeyRound, LockKeyhole } from "lucide-react";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";
import FormActions from "@/components/ui/FormActions";
import { useLocale } from "@/contexts/LocaleContext";
import { usePasswordForm } from "@/features/profile/hooks/usePasswordForm";

export default function PasswordForm() {
  const { translate } = useLocale();
  const {
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
    showErrors,
    errors,
    canSubmit,
    submit,
    cancel,
    touch,
  } = usePasswordForm();

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
          onToggleVisible={() => setShowCurrent((previous) => !previous)}
          error={showErrors ? errors.current?.[0] : undefined}
        />

        <PasswordField
          label={translate("profile.password.new")}
          placeholder={translate("profile.password.new_placeholder")}
          icon={KeyRound}
          value={newPassword}
          onChange={setNewPassword}
          visible={showNew}
          onToggleVisible={() => setShowNew((previous) => !previous)}
          error={showErrors ? errors.newPass?.[0] : undefined}
        />

        <PasswordField
          label={translate("profile.password.confirm")}
          placeholder={translate("profile.password.confirm_placeholder")}
          icon={LockKeyhole}
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirm}
          onToggleVisible={() => setShowConfirm((previous) => !previous)}
          error={showErrors ? errors.confirm?.[0] : undefined}
        />
      </div>

      <PasswordRequirements password={newPassword} />

      <div className="mt-6 rounded-xl border border-(--color-gold)/25 bg-(--color-gold)/8 p-3 text-xs text-(--color-gold-light)">
        {translate("profile.password.unavailable")}
      </div>

      <FormActions
        primaryLabel={translate("profile.password.update")}
        cancelLabel={translate("profile.password.cancel")}
        onPrimary={() => {
          touch();
          submit();
        }}
        onCancel={cancel}
        disabled={!canSubmit}
      />
    </main>
  );
}
