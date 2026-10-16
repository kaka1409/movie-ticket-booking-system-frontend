import { QRCodeSVG } from "qrcode.react";
import { useLocale } from "@/contexts/LocaleContext";

const QR_FALLBACK_BASE_URL = "https://primseat.com/tickets";

/**
 * Renders `value` as-is. Callers pass the backend's signed scan payload
 * (`ticketId.qrToken.signature`) when present — the check-in scanner verifies
 * the signature, so the QR must carry the payload, not a URL. The URL form
 * remains only as a fallback for tickets without a payload.
 */
export default function QRCode({ value, ticketId }: { value: string; ticketId?: string }) {
  const { translate } = useLocale();
  const content = value.includes(".") ? value : `${QR_FALLBACK_BASE_URL}/${ticketId ?? value}`;
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-white">
      <QRCodeSVG value={content} size={250} level="H" />
      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-(--color-text-muted)">
        {translate("tickets.detail.scan_enter")}
      </p>
    </div>
  );
}
