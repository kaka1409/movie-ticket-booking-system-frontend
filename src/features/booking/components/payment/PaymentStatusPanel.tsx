"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useLocale } from "@/contexts/LocaleContext";
import type { PaymentIntentStatus } from "@/features/booking/types";

/**
 * Every non-scanning state of the QR page — closed booking, expired attempt,
 * charge refunded, transport error, "not confirmed yet". Shared by both skins so
 * a state can never be worded or offered differently by width.
 */
export default function PaymentStatusPanel({
  slug,
  intentStatus,
  isClosed,
  isRefundQueued,
  isOpening,
  errorMessage,
  notice,
  onReopen,
}: {
  slug: string;
  intentStatus: PaymentIntentStatus | null;
  isClosed: boolean;
  isRefundQueued: boolean;
  isOpening: boolean;
  errorMessage: string | null;
  notice: string | null;
  onReopen: () => void;
}) {
  const { translate } = useLocale();
  const isExpired = intentStatus === "expired";

  const panel = isRefundQueued
    ? {
        title: "booking.payment.qr.refund_title",
        description: "booking.payment.qr.refund_desc",
        isError: false,
      }
    : isClosed
      ? {
          title: "booking.payment.qr.closed_title",
          description: "booking.payment.qr.closed_desc",
          isError: true,
        }
      : isExpired
        ? {
            title: "booking.payment.qr.expired_title",
            description: "booking.payment.qr.expired_desc",
            isError: false,
          }
        : null;

  if (!panel && !errorMessage && !notice) return null;

  return (
    <div className="space-y-3">
      {panel && (
        <div
          className={`rounded-2xl border bg-(--color-surface) p-4 ${
            panel.isError ? "border-red-500/40" : "border-(--color-border)"
          }`}
        >
          <p
            className={`text-sm font-bold ${
              panel.isError ? "text-red-400" : "text-(--color-gold)"
            }`}
          >
            {translate(panel.title)}
          </p>
          <p className="mt-1 text-xs text-(--color-text-muted)">{translate(panel.description)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {isRefundQueued && (
              <Button href="/" variant="outline" size="sm" fullWidth={false}>
                {translate("booking.payment.qr.back_home")}
              </Button>
            )}

            {isClosed && (
              <>
                <Button href={`/booking/${slug}/cinema`} size="sm" fullWidth={false}>
                  {translate("booking.payment.qr.start_over")}
                </Button>
                <Link
                  href="/"
                  className="text-xs font-bold text-(--color-text-muted) transition-colors hover:text-(--color-gold)"
                >
                  {translate("booking.payment.qr.back_home")}
                </Link>
              </>
            )}

            {isExpired && (
              <>
                <Button
                  size="sm"
                  fullWidth={false}
                  onClick={onReopen}
                  loading={isOpening}
                  disabled={isOpening}
                >
                  {translate("booking.payment.qr.retry")}
                </Button>
                <Link
                  href="/"
                  className="text-xs font-bold text-(--color-text-muted) transition-colors hover:text-(--color-gold)"
                >
                  {translate("booking.payment.qr.back_home")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {errorMessage && <ErrorAlert message={errorMessage} />}
      {notice && <p className="text-xs text-(--color-text-muted)">{notice}</p>}
    </div>
  );
}
