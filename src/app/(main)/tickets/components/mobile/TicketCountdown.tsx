"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useMounted } from "@/hooks/useMounted";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
/** Below an hour the seconds matter; above it a half-minute tick is plenty. */
const NEAR_MS = HOUR_MS;
/** An exact minute count stops being useful this close to the start. */
const SOON_MS = 5 * MINUTE_MS;

/** `translate()` has no interpolation — fill placeholders like the rest of the app. */
function fill(template: string, values: Record<string, number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

/**
 * Time-left ribbon pinned to the top of an upcoming poster — the card's status
 * chip is the remaining time instead of a static label. Client-only and
 * clock-driven, so it renders nothing until mounted (a server-rendered value
 * would mismatch on hydration) and ticks against the absolute deadline — a
 * throttled background tab shows the truth on its next tick, not a drifted
 * counter. The units are compact because the poster is ~96 px wide.
 */
export default function TicketCountdown({
  startsAtMs,
  endsAtMs,
}: {
  startsAtMs: number;
  endsAtMs: number;
}) {
  const { translate } = useLocale();
  const mounted = useMounted(0);
  const [now, setNow] = useState(() => Date.now());
  const near = startsAtMs - now < NEAR_MS;

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => setNow(Date.now()), near ? 1_000 : 30_000);
    return () => clearInterval(timer);
  }, [mounted, near]);

  if (!mounted) return null;
  if (now >= endsAtMs) return null;

  let label: string;
  if (now >= startsAtMs) {
    label = translate("tickets.countdown.in_progress");
  } else {
    const remaining = startsAtMs - now;
    label =
      remaining <= SOON_MS
        ? translate("tickets.countdown.starting_soon")
        : remaining >= DAY_MS
          ? fill(translate("tickets.countdown.days_hours"), {
              days: Math.floor(remaining / DAY_MS),
              hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
            })
          : remaining >= HOUR_MS
            ? fill(translate("tickets.countdown.hours_minutes"), {
                hours: Math.floor(remaining / HOUR_MS),
                minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
              })
            : fill(translate("tickets.countdown.minutes"), {
                minutes: Math.max(1, Math.floor(remaining / MINUTE_MS)),
              });
  }

  return (
    <span className="absolute inset-x-0 top-0 flex items-center justify-center gap-1 bg-black/70 px-1 py-1 text-center text-[9px] font-black uppercase leading-tight tracking-tight text-white backdrop-blur-[2px]">
      <Clock size={10} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
