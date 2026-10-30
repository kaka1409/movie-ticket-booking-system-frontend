"use client";

import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import ReceiptCard from "@/app/(sub)/booking/components/shared/ReceiptCard";
import PaymentIntentActions from "@/components/shared/payment/PaymentIntentActions";
import PaymentQrCard from "@/components/shared/payment/PaymentQrCard";
import PaymentStatusPanel from "@/components/shared/payment/PaymentStatusPanel";
import type { UsePaymentIntentResult } from "@/features/booking/hooks/usePaymentIntent";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

/**
 * Desktop QR screen: the scan surface in the content column, the order receipt
 * in the sticky rail. One column below `lg:`, where the rail drops under it —
 * the same rule the booking steps follow.
 */
export default function PaymentQrDesktop({
  slug,
  booking,
  methodLabel,
  isDemo,
  payment,
  paymentMethods,
}: {
  slug: string;
  booking: BookingDetail;
  methodLabel: string;
  isDemo: boolean;
  payment: UsePaymentIntentResult;
  paymentMethods: PaymentMethodOption[];
}) {
  const { translate } = useLocale();
  const canSync = payment.intent?.status === "pending" && !payment.isRefundQueued;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 lg:p-6">
        {/* Lifts every nested card to `--color-surface-2` (see global.css). */}
        <div className="surface-raised grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <div className="min-w-0 space-y-5">
            <header>
              <MicroLabel className="text-(--color-gold)">
                {translate("booking.payment.title")}
              </MicroLabel>
              <h1 className="mt-2 text-2xl font-extrabold text-(--color-text-primary)">
                {translate("booking.payment.qr.title")}
              </h1>
              <p className="mt-1.5 text-sm text-(--color-text-muted)">
                {translate("booking.payment.qr.subtitle")}
              </p>
            </header>

            <PaymentQrCard
              intent={payment.intent}
              amount={booking.totalPrice}
              methodLabel={methodLabel}
              expiresAt={booking.expiresAt}
              qrSize={248}
            />

            <PaymentStatusPanel
              slug={slug}
              intentStatus={payment.intent?.status ?? null}
              isClosed={payment.isClosed}
              isRefundQueued={payment.isRefundQueued}
              isOpening={payment.isOpening}
              errorMessage={payment.errorMessage}
              notice={payment.notice}
              onReopen={payment.reopen}
            />

            <PaymentIntentActions
              isDemo={isDemo}
              canSync={canSync}
              isSyncing={payment.isSyncing}
              isOpening={payment.isOpening}
              simulatingOutcome={payment.simulatingOutcome}
              onSync={payment.sync}
              onSimulate={payment.simulate}
            />
          </div>

          <aside className="lg:sticky lg:top-24">
            <ReceiptCard movie={undefined} booking={booking} paymentMethods={paymentMethods} />
          </aside>
        </div>
      </div>
    </div>
  );
}
