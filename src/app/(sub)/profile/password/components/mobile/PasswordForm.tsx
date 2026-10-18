"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, LockKeyhole } from "lucide-react";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";
import FormActions from "@/components/ui/FormActions";
import { useLocale } from "@/contexts/LocaleContext";
import { createPasswordSchema } from "@/features/profile/schema";

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

  const schema = useMemo(() => createPasswordSchema(translate), [translate]);
  const result = schema.safeParse({
    current: currentPassword,
    newPass: newPassword,
    confirm: confirmPassword,
  });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;
  const isValid = result.success;
  const showErrors = touched && !isValid;

  const handleSubmit = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    router.replace("/profile");
  };

  const handleCancel = () => {
    router.replace("/profile");
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
          error={showErrors ? errors.current?.[0] : undefined}
        />

        <PasswordField
          label={translate("profile.password.new")}
          placeholder={translate("profile.password.new_placeholder")}
          icon={KeyRound}
          value={newPassword}
          onChange={setNewPassword}
          visible={showNew}
          onToggleVisible={() => setShowNew((v) => !v)}
          error={showErrors ? errors.newPass?.[0] : undefined}
        />

        <PasswordField
          label={translate("profile.password.confirm")}
          placeholder={translate("profile.password.confirm_placeholder")}
          icon={LockKeyhole}
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirm}
          onToggleVisible={() => setShowConfirm((v) => !v)}
          error={showErrors ? errors.confirm?.[0] : undefined}
        />
      </div>

      <PasswordRequirements password={newPassword} />

      <FormActions
        primaryLabel={translate("profile.password.update")}
        cancelLabel={translate("profile.password.cancel")}
        onPrimary={handleSubmit}
        onCancel={handleCancel}
      />
    </main>
  );
}
