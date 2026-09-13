"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import InputField from "./InputField";

export default function PasswordField({
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <InputField
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      icon={LockKeyhole}
      autoComplete={autoComplete}
      error={error}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          className="shrink-0 text-(--color-text-muted) transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}
