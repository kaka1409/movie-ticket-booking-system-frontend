"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, LockKeyhole } from "lucide-react";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";
import FormActions from "./FormActions";

function validate(
  current: string,
  newPass: string,
  confirm: string,
) {
  const errors: { current?: string; newPass?: string; confirm?: string } = {};
  if (!current.trim()) errors.current = "Current password is required.";
  if (!newPass.trim()) {
    errors.newPass = "New password is required.";
  } else if (
    newPass.length < 8 ||
    !/[A-Z]/.test(newPass) ||
    !/[0-9]/.test(newPass) ||
    !/[!@#$%^&*]/.test(newPass)
  ) {
    errors.newPass = "New password does not meet all requirements.";
  }
  if (!confirm.trim()) {
    errors.confirm = "Please confirm your new password.";
  } else if (confirm !== newPass) {
    errors.confirm = "Passwords do not match.";
  }
  return errors;
}

export default function PasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);

  const errors = validate(currentPassword, newPassword, confirmPassword);
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
          label="Current Password"
          placeholder="Enter current password"
          icon={Lock}
          value={currentPassword}
          onChange={setCurrentPassword}
          visible={showCurrent}
          onToggleVisible={() => setShowCurrent((v) => !v)}
          error={showErrors ? errors.current : undefined}
        />

        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          icon={KeyRound}
          value={newPassword}
          onChange={setNewPassword}
          visible={showNew}
          onToggleVisible={() => setShowNew((v) => !v)}
          error={showErrors ? errors.newPass : undefined}
        />

        <PasswordField
          label="Confirm New Password"
          placeholder="Confirm new password"
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
