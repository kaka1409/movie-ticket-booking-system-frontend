"use client";

import { Lock, KeyRound, LockKeyhole, ShieldCheck, CheckCircle2 } from "lucide-react";
import PasswordField from "@/components/ui/PasswordField";
import PasswordRequirements from "../shared/PasswordRequirements";
import Button from "@/components/ui/Button";
import AccountShell from "@/components/shared/profile/desktop/AccountShell";
import { useLocale } from "@/contexts/LocaleContext";
import { usePasswordForm } from "@/features/profile/hooks/usePasswordForm";

/**
 * Desktop change-password view:
 * Top security status banner, password input fields with live validation,
 * right column with interactive requirements checklist and security recommendations.
 */
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          {/* Prominent Security Notice Banner at the top */}
          <div className="mb-6 rounded-2xl border border-(--color-gold)/30 bg-gradient-to-r from-(--color-gold)/10 via-(--color-surface-2) to-(--color-surface) p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-gold)/20 text-(--color-gold)">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {translate("profile.password.security_status")}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-(--color-gold-light)">
                  {translate("profile.password.unavailable")}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
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

          {/* Actions */}
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

        {/* Right Rail: Requirements & Security Tips */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <PasswordRequirements password={newPassword} />

          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 text-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-white">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>{translate("profile.password.session_active")}</span>
            </div>
            <p className="leading-relaxed text-(--color-text-muted)">
              {translate("profile.password.recommendation")}
            </p>
          </div>
        </aside>
      </div>
    </AccountShell>
  );
}
