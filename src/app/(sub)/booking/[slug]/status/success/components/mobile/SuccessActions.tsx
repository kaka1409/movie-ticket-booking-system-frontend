"use client";

import Link from "next/link";
import { Download, Home } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function SuccessActions({
  onDownload,
  isDownloading,
}: {
  onDownload: () => void;
  isDownloading: boolean;
}) {
  const { translate } = useLocale();

  return (
    <Reveal delay={500} className="px-4 space-y-3 pb-4">
      <Button icon={Download} onClick={onDownload} loading={isDownloading}>
        {translate("booking.status.success.download")}
      </Button>

      <Link
        href="/"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-(--color-text-secondary) bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/30 hover:text-(--color-gold) active:scale-[0.98] transition duration-150"
      >
        <Home size={17} />
        {translate("booking.common.back_to_home")}
      </Link>
    </Reveal>
  );
}
