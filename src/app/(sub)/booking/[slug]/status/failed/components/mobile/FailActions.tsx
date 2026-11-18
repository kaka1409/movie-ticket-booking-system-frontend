"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw, Home, ChevronRight, HeadphonesIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FailActions() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { translate } = useLocale();

  return (
    <>
      <Reveal delay={500} className="px-4 space-y-3">
        <Button icon={RefreshCw} onClick={() => router.push(`/booking/${slug}/payment`)}>
          {translate("booking.status.failed.retry")}
        </Button>

        <Button variant="outline" icon={Home} onClick={() => router.push("/")}>
          {translate("booking.common.back_to_home")}
        </Button>
      </Reveal>

      <Reveal variant="fade" delay={600} className="px-4 pb-4">
        <Link
          href="/help"
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-(--color-surface) border border-(--color-border) hover:border-(--color-gold)/20 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-(--color-surface-2) flex items-center justify-center text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors">
              <HeadphonesIcon size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-(--color-text-secondary) group-hover:text-(--color-gold) transition-colors">
                {translate("booking.status.failed.need_help")}
              </p>
              <p className="text-xs text-(--color-text-muted)">
                {translate("booking.status.failed.contact_support")}
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors"
          />
        </Link>
      </Reveal>
    </>
  );
}
