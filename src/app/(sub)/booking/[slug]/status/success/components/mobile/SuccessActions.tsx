"use client";

import Link from "next/link";
import { Download, Home } from "lucide-react";
import { useStatus } from "@/features/booking/contexts/StatusContext";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

export default function SuccessActions() {
  const { mounted } = useStatus();
  const { translate } = useLocale();

  return (
    <div
      className={`px-4 space-y-3 pb-4 transition-all duration-700 delay-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Button icon={Download}>
        {translate("booking.status.success.download")}
      </Button>

      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition-all duration-150"
      >
        <Home size={17} />
        {translate("booking.common.back_to_home")}
      </Link>
    </div>
  );
}
