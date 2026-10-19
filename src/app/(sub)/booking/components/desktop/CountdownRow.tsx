"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { formatCountdown, useCountdownRemaining } from "@/features/booking/countdown";
import MicroLabel from "@/components/ui/MicroLabel";

/**
 * Session clock as a rail row — same ticking source as the mobile countdown
 * banner (`CountdownProvider`), so both skins show the identical second.
 */
export default function CountdownRow() {
  const { translate } = useLocale();
  const remaining = useCountdownRemaining();
  const expired = remaining <= 0;

  return (
    <div className="flex items-center justify-between">
      <MicroLabel className="text-(--color-text-muted)">
        {expired
          ? translate("booking.common.time_expired")
          : translate("booking.common.time_remaining")}
      </MicroLabel>
      <span
        className={`text-base font-extrabold tabular-nums ${
          expired ? "text-red-500" : "text-(--color-gold)"
        }`}
      >
        {formatCountdown(remaining)}
      </span>
    </div>
  );
}
