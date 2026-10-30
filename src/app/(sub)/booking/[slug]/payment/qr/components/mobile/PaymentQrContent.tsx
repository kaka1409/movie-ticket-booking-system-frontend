"use client";

import { useLocale } from "@/contexts/LocaleContext";
import MicroLabel from "@/components/ui/MicroLabel";
import ReceiptCard from "@/app/(sub)/booking/components/shared/ReceiptCard";
import PaymentIntentActions from "@/components/shared/payment/PaymentIntentActions";
import PaymentQrCard from "@/components/shared/payment/PaymentQrCard";
import PaymentStatusPanel from "@/components/shared/payment/PaymentStatusPanel";
import type { UsePaymentIntentResult } from "@/features/booking/hooks/usePaymentIntent";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

export default function PaymentQrMobile({
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
    <div className="min-h-dvh bg-(--color-bg)">
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-6 pb-10">
        <header>
          <MicroLabel className="text-(--color-gold)">
            {translate("booking.payment.title")}
          </MicroLabel>
          <h1 className="mt-1.5 text-xl font-extrabold text-(--color-text-primary)">
            {translate("booking.payment.qr.title")}
          </h1>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {translate("booking.payment.qr.subtitle")}
          </p>
        </header>

        <PaymentQrCard
          intent={payment.intent}
          amount={booking.totalPrice}
          methodLabel={methodLabel}
          expiresAt={booking.expiresAt}
          qrSize={216}
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

        <ReceiptCard movie={undefined} booking={booking} paymentMethods={paymentMethods} />
      </main>
    </div>
  );
}
