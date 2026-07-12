"use client";

import Link from "next/link";

export default function TermsNote() {
  return (
    <p className="text-xs text-(--color-text-muted) text-center leading-relaxed px-4">
      By clicking Confirm Payment, you agree to our{" "}
      <Link
        href="/terms"
        className="text-(--color-gold) underline underline-offset-2"
      >
        Terms &amp; Conditions
      </Link>
      .
    </p>
  );
}
