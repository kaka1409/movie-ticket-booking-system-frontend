"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import InputField from "./InputField";

export default function PasswordField({
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  visible,
  onToggleVisible,
  label,
  icon = LockKeyhole,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  /** Controlled visibility (optional). When omitted the field owns its state. */
  visible?: boolean;
  onToggleVisible?: () => void;
  label?: string;
  icon?: React.ElementType;
}) {
  const [internalShow, setInternalShow] = useState(false);
  const controlled = visible !== undefined && onToggleVisible !== undefined;
  const show = controlled ? visible! : internalShow;
  const toggle = controlled ? onToggleVisible! : () => setInternalShow((previous) => !previous);
  const { translate } = useLocale();

  return (
    <InputField
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
      label={label}
      autoComplete={autoComplete}
      error={error}
      rightSlot={
        <button
          type="button"
          onClick={toggle}
          className="shrink-0 text-(--color-text-muted) transition-colors"
          aria-label={show ? translate("common.hide_password") : translate("common.show_password")}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}
