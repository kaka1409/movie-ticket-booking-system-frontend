"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, HeadphonesIcon, Home, RefreshCw } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";

/**
 * Desktop failure side panel: retry and home on top, then the support entry —
 * the mobile stack kept, but living in the rail beside the receipt.
 */
export default function FailSidePanel() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const mounted = useMounted();
  const { translate } = useLocale();

  return (
    <aside
      className={`space-y-4 transition duration-700 delay-500 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <Button icon={RefreshCw} onClick={() => router.push(`/booking/${slug}/payment`)}>
          {translate("booking.status.failed.retry")}
        </Button>

        <Button variant="outline" icon={Home} href="/">
          {translate("booking.common.back_to_home")}
        </Button>
      </div>

      <Link
        href="/help"
        className="group flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 no-underline transition-colors hover:border-(--color-gold)/20"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-surface-2) text-(--color-text-muted) transition-colors group-hover:text-(--color-gold)">
            <HeadphonesIcon size={15} />
          </div>
          <div>
            <p className="text-sm font-semibold text-(--color-text-secondary) transition-colors group-hover:text-(--color-gold)">
              {translate("booking.status.failed.need_help")}
            </p>
            <p className="text-xs text-(--color-text-muted)">
              {translate("booking.status.failed.contact_support")}
            </p>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="text-(--color-text-muted) transition-colors group-hover:text-(--color-gold)"
        />
      </Link>
    </aside>
  );
}
