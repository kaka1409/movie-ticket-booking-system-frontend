"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, Home } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import type { BookingDetail } from "@/features/booking/types";

/**
 * Desktop success side panel: the scan payload, its booking reference and the
 * two success actions. It mirrors the mobile card's QR block but keeps the
 * reference and the CTAs stacked in the rail instead of under the receipt.
 */
export default function SuccessSidePanel({
  booking,
  transactionId,
}: {
  booking: BookingDetail | null;
  transactionId: string;
}) {
  const mounted = useMounted();
  const { translate } = useLocale();

  const bookingRef = booking ? (booking.transactionRef ?? booking.id) : transactionId;
  const qrValue = `https://primseat.com/tickets/${booking ? booking.id : transactionId}`;

  return (
    <aside
      className={`transition duration-700 delay-500 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 print-keep">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6">
          <QRCodeSVG value={qrValue} size={220} level="H" className="print-qr" />
          <p className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
            {translate("booking.common.scan_enter")}
          </p>
        </div>

        <p className="mt-4 text-center text-xs tracking-wide text-(--color-text-muted)">
          {translate("booking.status.success.booking_id")}
          <span className="font-bold text-(--color-text-primary)">#{bookingRef}</span>
        </p>

        <div className="mt-5 space-y-3">
          <Button icon={Download}>{translate("booking.status.success.download")}</Button>
          <Button variant="outline" icon={Home} href="/">
            {translate("booking.common.back_to_home")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
