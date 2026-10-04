"use client";

import FormField from "./FormField";

export default function InputField({
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
  error,
  disabled,
  autoComplete,
  inputMode,
}: {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
  rightSlot?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <FormField icon={icon} disabled={disabled} error={error} rightSlot={rightSlot}>
      <input
        type={type}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
      />
    </FormField>
  );
}
