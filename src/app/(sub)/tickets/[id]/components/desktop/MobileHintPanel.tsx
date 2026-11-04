"use client";

import { Smartphone, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const PANEL_CLASS =
  "space-y-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg";

/**
 * Desktop-only hint panel directing users to access this page on mobile
 * for easier QR code scanning at the cinema. Includes illustration icon
 * and bullet points for better visual balance.
 */
export default function MobileHintPanel() {
  const { translate } = useLocale();

  return (
    <section className={PANEL_CLASS}>
      <div className="flex items-start gap-4">
        <span className="flex shrink-0 items-center justify-center w-16 h-16 rounded-2xl bg-(--color-gold)/10 border border-(--color-gold)/20">
          <Smartphone size={32} className="text-(--color-gold)" />
        </span>

        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm font-bold text-white">
            {translate("tickets.detail.mobile_hint.title")}
          </h3>
          <p className="text-xs text-(--color-text-muted) leading-relaxed">
            {translate("tickets.detail.mobile_hint.description")}
          </p>
        </div>
      </div>

      <div className="w-full space-y-2.5 text-left">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 size={16} className="shrink-0 text-(--color-gold) mt-0.5" />
          <span className="text-xs text-(--color-text-secondary)">
            {translate("tickets.detail.mobile_hint.benefit_1")}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 size={16} className="shrink-0 text-(--color-gold) mt-0.5" />
          <span className="text-xs text-(--color-text-secondary)">
            {translate("tickets.detail.mobile_hint.benefit_2")}
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 size={16} className="shrink-0 text-(--color-gold) mt-0.5" />
          <span className="text-xs text-(--color-text-secondary)">
            {translate("tickets.detail.mobile_hint.benefit_3")}
          </span>
        </div>
      </div>
    </section>
  );
}
