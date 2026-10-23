"use client";

import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubmitBooking } from "@/features/booking/hooks/useSubmitBooking";
import Button from "@/components/ui/Button";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";
import RailSummary from "@/app/(sub)/booking/components/desktop/RailSummary";
import type { PaymentMethodOption } from "@/features/booking/types";
import PaymentHeader from "../mobile/PaymentHeader";
import PaymentOption from "../mobile/PaymentOption";
import SecureBadge from "../mobile/SecureBadge";
import TermsNote from "../mobile/TermsNote";

/**
 * Desktop payment step: the gateway picker in the content column, the final
 * summary and the pay CTA in the rail.
 *
 * `useSubmitBooking` owns the whole create → pay → route sequence (shared with
 * the mobile bar), so this component never talks to the actions directly and
 * the pay error surfaces in exactly one place.
 */
export default function PaymentContent({
  paymentMethods,
  isDemo,
}: {
  paymentMethods: PaymentMethodOption[];
  isDemo: boolean;
}) {
  const { translate } = useLocale();
  const { canPay, isLoading, errorMessage, submit } = useSubmitBooking();

  return (
    <BookingStepLayout
      current={5}
      summary={
        <>
          <CountdownRow />
          <RailSummary />
        </>
      }
      action={
        <Button onClick={submit} disabled={!canPay} loading={isLoading} icon={ArrowRight}>
          {isLoading
            ? translate("booking.payment.processing")
            : translate("booking.payment.confirm")}
        </Button>
      }
      errorText={errorMessage}
    >
      <div className="space-y-6">
        <PaymentHeader />

        <div className="grid gap-3 xl:grid-cols-2">
          {paymentMethods.map((method) => (
            <PaymentOption key={method.id} method={method} isDemo={isDemo} />
          ))}
        </div>

        <SecureBadge />
        <TermsNote />
      </div>
    </BookingStepLayout>
  );
}
