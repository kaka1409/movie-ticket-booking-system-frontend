"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatVND } from "@/libs/utils";
import MicroLabel from "@/components/ui/MicroLabel";
import type { PaymentIntent } from "@/features/booking/types";

/** `mm:ss` left until the booking's payment window closes. */
function toClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * The scan surface: amount, provider code, reference and the window clock.
 * The clock is display only — the backend decides when an attempt expires, and
 * the page polls that decision rather than closing itself.
 */
export default function PaymentQrCard({
  intent,
  amount,
  methodLabel,
  expiresAt,
  qrSize = 232,
}: {
  intent: PaymentIntent | null;
  amount: number;
  methodLabel: string;
  /** The booking's payment deadline (ISO instant). */
  expiresAt: string | null;
  qrSize?: number;
}) {
  const { translate, locale } = useLocale();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const deadline = expiresAt === null ? null : Date.parse(expiresAt);
  const secondsLeft = deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));
  const isWindowClosed = secondsLeft !== null && secondsLeft === 0;

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <MicroLabel className="text-(--color-gold)">
            {translate("booking.payment.qr.scan_label")}
          </MicroLabel>
          <p className="mt-1.5 text-2xl font-extrabold text-(--color-text-primary)">
            {formatVND(amount, locale)}
          </p>
        </div>
        {secondsLeft !== null && (
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
              isWindowClosed
                ? "border-red-500/40 text-red-400"
                : "border-(--color-border) text-(--color-gold)"
            }`}
          >
            {isWindowClosed ? translate("booking.payment.qr.window_closed") : toClock(secondsLeft)}
          </span>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        {intent?.qrPayload ? (
          <div className="rounded-2xl bg-white p-4">
            <QRCodeSVG value={intent.qrPayload} size={qrSize} level="M" marginSize={0} />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-3 py-14 text-center">
            <Loader2 size={26} className="animate-spin text-(--color-gold)" />
            <p className="text-sm text-(--color-text-muted)">
              {translate("booking.payment.qr.opening")}
            </p>
          </div>
        )}
      </div>

      {intent?.payUrl && intent.kind === "redirect" && (
        <a
          href={intent.payUrl}
          className="mt-4 block text-center text-sm font-bold text-(--color-gold) underline underline-offset-4"
        >
          {translate("booking.payment.qr.open_wallet")}
        </a>
      )}

      <dl className="mt-5 space-y-2 border-t border-(--color-border) pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-(--color-text-muted)">{translate("booking.payment.qr.method")}</dt>
          <dd className="font-semibold text-(--color-text-primary)">{methodLabel}</dd>
        </div>
        {intent?.transactionRef && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-(--color-text-muted)">
              {translate("booking.payment.qr.reference")}
            </dt>
            <dd className="truncate font-mono text-xs text-(--color-text-secondary)">
              {intent.transactionRef}
            </dd>
          </div>
        )}
        <p className="pt-1 text-xs text-(--color-text-muted)">
          {translate("booking.payment.qr.waiting")}
        </p>
      </dl>
    </div>
  );
}
