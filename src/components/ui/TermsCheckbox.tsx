"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function TermsCheckbox({
  checked,
  onChange,
  error,
  translate,
}: {
  checked: boolean;
  onChange: () => void;
  error?: string;
  translate: (key: string) => string;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onChange}
        className="flex items-start gap-3 text-left w-full"
        aria-pressed={checked}
      >
        <span
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
            checked
              ? "bg-(--color-gold) border-(--color-gold)"
              : error
                ? "border-red-500/60 bg-transparent"
                : "border-(--color-border) bg-transparent"
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="#0F0F0F"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="text-sm text-(--color-text-muted) leading-relaxed">
          {translate("auth.register.terms_prefix")}
          <Link
            href="/terms"
            onClick={(event) => event.stopPropagation()}
            className="text-(--color-gold) underline underline-offset-2"
          >
            {translate("auth.register.terms_of_service")}
          </Link>
          {translate("auth.register.terms_and")}
          <Link
            href="/privacy"
            onClick={(event) => event.stopPropagation()}
            className="text-(--color-gold) underline underline-offset-2"
          >
            {translate("auth.register.privacy_policy")}
          </Link>
          {translate("auth.register.terms_suffix")}
        </span>
      </button>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
