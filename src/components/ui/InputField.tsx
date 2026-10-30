"use client";

import FormField from "./FormField";

export default function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  label,
  id,
  rightSlot,
  error,
  disabled,
  autoComplete,
  inputMode,
  maxLength,
}: {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
  label?: string;
  id?: string;
  rightSlot?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <FormField label={label} icon={icon} disabled={disabled} error={error} rightSlot={rightSlot}>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
      />
    </FormField>
  );
}
