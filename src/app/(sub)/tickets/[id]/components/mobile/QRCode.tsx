import { QRCodeSVG } from "qrcode.react";
import { useLocale } from "@/contexts/LocaleContext";

const QR_BASE_URL = "https://primseat.com/tickets";

export default function QRCode({ value }: { value: string }) {
  const { translate } = useLocale();
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-white">
      <QRCodeSVG
        value={`${QR_BASE_URL}/${value}`}
        size={250}
        level="H"
      />
      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-(--color-text-muted)">
        {translate("tickets.detail.scan_enter")}
      </p>
    </div>
  );
}
