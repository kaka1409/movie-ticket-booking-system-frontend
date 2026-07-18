"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LocaleContext";

export default function TermsNote() {
  const { translate } = useLocale();
  return (
    <p className="text-xs text-(--color-text-muted) text-center leading-relaxed px-4">
      {translate("booking.payment.terms_prefix")}
      <Link
        href="/terms"
        className="text-(--color-gold) underline underline-offset-2"
      >
        {translate("booking.payment.terms_link")}
      </Link>
      .
    </p>
  );
}
