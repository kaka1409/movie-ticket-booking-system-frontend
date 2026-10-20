"use client";

import { Lock, KeyRound, LockKeyhole, Info } from "lucide-react";
import PasswordField from "../mobile/PasswordField";
import PasswordRequirements from "../mobile/PasswordRequirements";
import Button from "@/components/ui/Button";
import AccountShell from "@/features/profile/components/desktop/AccountShell";
import { useLocale } from "@/contexts/LocaleContext";
import { usePasswordForm } from "@/features/profile/hooks/usePasswordForm";

export default function ChangePasswordContent() {
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
    <AccountShell
      title={translate("profile.change_password")}
      description={translate("profile.pages.password_desc")}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div className="min-w-0">
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

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-(--color-gold)/25 bg-(--color-gold)/8 p-3 text-xs text-(--color-gold-light)">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>{translate("profile.password.unavailable")}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-(--color-border) pt-6 lg:flex-row lg:justify-end">
            <Button variant="outline" size="md" fullWidth={false} onClick={cancel}>
              {translate("profile.password.cancel")}
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth={false}
              disabled={!canSubmit}
              onClick={() => {
                touch();
                submit();
              }}
            >
              {translate("profile.password.update")}
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <PasswordRequirements password={newPassword} />
        </aside>
      </div>
    </AccountShell>
  );
}
