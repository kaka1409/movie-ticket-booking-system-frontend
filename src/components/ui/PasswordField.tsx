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
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const { translate } = useLocale();

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
          aria-label={show ? translate("common.hide_password") : translate("common.show_password")}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  );
}
