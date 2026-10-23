"use client";

import { Ban, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import { useLocale } from "@/contexts/LocaleContext";
import type { SimulatedOutcome } from "@/features/booking/types";

const DEMO_OPTIONS: {
  outcome: SimulatedOutcome;
  labelKey: string;
  icon: typeof CheckCircle2;
}[] = [
  { outcome: "success", labelKey: "booking.payment.qr.demo_success", icon: CheckCircle2 },
  { outcome: "failure", labelKey: "booking.payment.qr.demo_failure", icon: XCircle },
  { outcome: "cancelled", labelKey: "booking.payment.qr.demo_cancelled", icon: Ban },
];

/**
 * The two manual controls: ask the provider for the truth, and (in demo mode)
 * script the provider's answer. Both are shared by the two skins — they drive
 * the same server calls, so their availability must not differ by width.
 */
export default function PaymentIntentActions({
  isDemo,
  canSync,
  isSyncing,
  isOpening,
  simulatingOutcome,
  onSync,
  onSimulate,
}: {
  isDemo: boolean;
  /** False once the attempt settled — there is nothing left to reconcile. */
  canSync: boolean;
  isSyncing: boolean;
  isOpening: boolean;
  simulatingOutcome: SimulatedOutcome | null;
  onSync: () => void;
  onSimulate: (outcome: SimulatedOutcome) => void;
}) {
  const { translate } = useLocale();
  const isBusy = isSyncing || isOpening || simulatingOutcome !== null;

  return (
    <div className="space-y-3">
      {canSync && (
        <Button
          variant="outline"
          size="md"
          onClick={onSync}
          loading={isSyncing}
          disabled={isBusy}
          icon={RefreshCw}
          iconPosition="left"
        >
          {translate("booking.payment.qr.check_status")}
        </Button>
      )}

      {isDemo && (
        <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-surface) p-4">
          <MicroLabel className="text-(--color-text-muted)">
            {translate("booking.payment.qr.demo_title")}
          </MicroLabel>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {translate("booking.payment.qr.demo_hint")}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {DEMO_OPTIONS.map(({ outcome, labelKey, icon }) => (
              <Button
                key={outcome}
                variant="loadMore"
                size="sm"
                uppercase={false}
                onClick={() => onSimulate(outcome)}
                loading={simulatingOutcome === outcome}
                disabled={isBusy && simulatingOutcome !== outcome}
                icon={icon}
                iconPosition="left"
              >
                {translate(labelKey)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
