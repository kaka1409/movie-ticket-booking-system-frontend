"use client";

import { useId } from "react";
import FormField, { type FormFieldSize } from "./FormField";

export interface InputFieldProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ElementType;
  label?: string;
  id?: string;
  rightSlot?: React.ReactNode;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  size?: FormFieldSize;
  uppercaseLabel?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}

/**
 * Standard text input field integrated with FormField wrapper,
 * supporting desktop-responsive sizing, label, icons, and error states.
 */
export default function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  label,
  id: customId,
  rightSlot,
  error,
  hint,
  disabled,
  required,
  size = "md",
  uppercaseLabel,
  className,
  autoComplete,
  inputMode,
  maxLength,
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = customId || generatedId;

  return (
    <FormField
      id={inputId}
      label={label}
      icon={icon}
      disabled={disabled}
      required={required}
      error={error}
      hint={hint}
      size={size}
      uppercaseLabel={uppercaseLabel}
      className={className}
      rightSlot={rightSlot}
    >
      <input
        id={inputId}
        type={type}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 min-w-0 bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) disabled:cursor-not-allowed"
      />
    </FormField>
  );
}
