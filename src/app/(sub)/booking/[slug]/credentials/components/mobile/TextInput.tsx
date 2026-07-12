"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export default function TextInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  autoComplete,
  inputMode,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div
        className={`
          flex items-center gap-3 px-4 py-3.5 rounded-2xl
          bg-(--color-surface) border transition-all duration-150
          ${error ? "border-red-500/70" : focused ? "border-(--color-gold)/60" : "border-(--color-border)"}
        `}
      >
        <Icon
          size={17}
          className={`flex-shrink-0 transition-colors duration-150 ${
            error ? "text-red-400" : focused ? "text-(--color-gold)" : "text-(--color-text-muted)"
          }`}
        />
        <input
          id={id}
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-(--color-text-primary) placeholder-(--color-text-muted) outline-none font-[inherit]"
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
