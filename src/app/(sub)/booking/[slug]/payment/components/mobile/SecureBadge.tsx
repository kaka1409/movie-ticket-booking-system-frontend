"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function SecureBadge() {
  const { translate } = useLocale();
  return (
    <div className="flex items-center justify-center gap-1.5 px-4">
      <ShieldCheck size={13} className="text-(--color-text-muted)" />
      <span className="text-xs text-(--color-text-muted)">
        {translate("booking.payment.secure_badge")}
      </span>
    </div>
  );
}
