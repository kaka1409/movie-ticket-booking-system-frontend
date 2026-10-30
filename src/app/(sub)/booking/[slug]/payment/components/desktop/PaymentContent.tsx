"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubmitBooking } from "@/features/booking/hooks/useSubmitBooking";
import Button from "@/components/ui/Button";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";
import RailSummary from "@/app/(sub)/booking/components/desktop/RailSummary";
import PaymentHeader from "../shared/PaymentHeader";
import SecureBadge from "../shared/SecureBadge";
import TermsNote from "../shared/TermsNote";

/**
 * Desktop payment step: the gateway picker arrives as `slots`, so the shell —
 * stepper, final summary and pay CTA — paints before the catalog lands.
 *
 * `useSubmitBooking` owns the whole create → pay → route sequence (shared with
 * the mobile bar), so this component never talks to the actions directly and
 * the pay error surfaces in exactly one place.
 */
export default function PaymentContent({ slots }: { slots: ReactNode }) {
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
        <div className="grid gap-3 xl:grid-cols-2">{slots}</div>
        <SecureBadge />
        <TermsNote />
      </div>
    </BookingStepLayout>
  );
}
