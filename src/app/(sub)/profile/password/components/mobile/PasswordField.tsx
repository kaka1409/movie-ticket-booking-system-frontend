"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function PasswordField({
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  visible,
  onToggleVisible,
  error,
}: {
  label: string;
  placeholder: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const { translate } = useLocale();

  return (
    <label className="flex flex-col gap-2">
      <span className="px-1 text-xs font-bold tracking-widest text-(--color-gold-light)">
        {label.toUpperCase()}
      </span>
      <div
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`flex items-center gap-3 rounded-xl border bg-(--color-surface) px-4 py-3.5 transition-all duration-150 ${
          error
            ? "border-red-500/70"
            : focused
            ? "border-(--color-gold)/60"
            : "border-(--color-border)"
        }`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 transition-colors duration-150 ${
            error
              ? "text-red-400"
              : focused
              ? "text-(--color-gold)"
              : "text-(--color-text-muted)"
          }`}
        />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted)"
        />
        <button
          type="button"
          aria-label={visible ? translate("profile.password.hide_password") : translate("profile.password.show_password")}
          onClick={onToggleVisible}
          className="shrink-0 text-(--color-text-muted)"
        >
          {visible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </label>
  );
}
