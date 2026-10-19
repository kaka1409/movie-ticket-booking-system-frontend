"use client";

import { useLocale } from "@/contexts/LocaleContext";

export default function SnackHeader({ className = "px-4 pt-1" }: { className?: string }) {
  const { translate } = useLocale();

  return (
    <div className={className}>
      <h2 className="font-extrabold text-2xl text-(--color-text-primary) mb-1">
        {translate("booking.snack.heading")}
      </h2>
      <p className="text-sm text-(--color-text-muted)">{translate("booking.snack.subtitle")}</p>
    </div>
  );
}
