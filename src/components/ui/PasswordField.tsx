"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import InputField from "./InputField";
import type { FormFieldSize } from "./FormField";

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  hint?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  size?: FormFieldSize;
  className?: string;
  autoComplete?: string;
  /** Controlled visibility (optional). When omitted the field owns its state. */
  visible?: boolean;
  onToggleVisible?: () => void;
  label?: string;
  icon?: React.ElementType;
}

/**
 * Password input with integrated visibility toggle and FormField wrapper.
 */
export default function PasswordField({
  value,
  onChange,
  placeholder,
  error,
  hint,
  id,
  disabled,
  required,
  size,
  className,
  autoComplete,
  visible,
  onToggleVisible,
  label,
  icon = LockKeyhole,
}: PasswordFieldProps) {
  const [internalShow, setInternalShow] = useState(false);
  const controlled = visible !== undefined && onToggleVisible !== undefined;
  const show = controlled ? visible : internalShow;
  const toggle = controlled ? onToggleVisible : () => setInternalShow((previous) => !previous);
  const { translate } = useLocale();

  return (
    <InputField
      id={id}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={icon}
      label={label}
      disabled={disabled}
      required={required}
      size={size}
      className={className}
      autoComplete={autoComplete}
      error={error}
      hint={hint}
      rightSlot={
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          className="shrink-0 p-0.5 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label={show ? translate("common.hide_password") : translate("common.show_password")}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}
