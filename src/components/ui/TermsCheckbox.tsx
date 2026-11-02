"use client";

import Link from "next/link";
import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { PRESS_CLASS } from "@/libs/press";

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
  const textId = useId();

  return (
    <div>
      <div className="flex w-full items-start gap-3 text-left">
        {/* A real button owning `role="checkbox"` keeps Space/Enter free; the
            sentence is a plain span so the two policy links can live inside it. */}
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          aria-labelledby={textId}
          onClick={onChange}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${PRESS_CLASS} ${
            checked
              ? "border-(--color-gold) bg-(--color-gold)"
              : error
                ? "border-red-500/60 bg-transparent hover:border-red-400"
                : "border-(--color-border) bg-transparent hover:border-(--color-gold)/50"
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
        </button>
        <span
          id={textId}
          onClick={onChange}
          className="cursor-pointer select-none text-sm leading-relaxed text-(--color-text-muted)"
        >
          {translate("auth.register.terms_prefix")}
          <Link
            href="/terms"
            onClick={(event) => event.stopPropagation()}
            className="text-(--color-gold) underline underline-offset-2 hover:text-(--color-gold-light)"
          >
            {translate("auth.register.terms_of_service")}
          </Link>
          {translate("auth.register.terms_and")}
          <Link
            href="/privacy"
            onClick={(event) => event.stopPropagation()}
            className="text-(--color-gold) underline underline-offset-2 hover:text-(--color-gold-light)"
          >
            {translate("auth.register.privacy_policy")}
          </Link>
          {translate("auth.register.terms_suffix")}
        </span>
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs text-red-400">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
