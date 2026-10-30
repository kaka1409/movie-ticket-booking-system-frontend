"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { createContactSchema } from "@/features/booking/schema";
import Button from "@/components/ui/Button";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import CountdownRow from "@/app/(sub)/booking/components/desktop/CountdownRow";
import RailSummary from "@/app/(sub)/booking/components/desktop/RailSummary";
import ContactForm from "../shared/ContactForm";

/**
 * Desktop contact step: the shared contact form in the content column, the
 * running order and the payment CTA in the rail.
 *
 * Validation reads the same booking draft `ContactForm` writes into (the
 * credentials step has no separate context), so the CTA state and the inline
 * field errors can never disagree.
 */
export default function CredentialsContent({ slug }: { slug: string }) {
  const { translate } = useLocale();
  const { contactName, contactEmail, contactPhone } = useBooking();

  const isValid = useMemo(() => {
    const schema = createContactSchema(translate);
    return schema.safeParse({ name: contactName, email: contactEmail, phone: contactPhone })
      .success;
  }, [translate, contactName, contactEmail, contactPhone]);

  return (
    <BookingStepLayout
      current={4}
      summary={
        <>
          <CountdownRow />
          <RailSummary />
        </>
      }
      action={
        <Button
          href={isValid ? `/booking/${slug}/payment` : undefined}
          disabled={!isValid}
          icon={ArrowRight}
        >
          {translate("booking.credentials.continue_payment")}
        </Button>
      }
    >
      <ContactForm className="space-y-4" />
    </BookingStepLayout>
  );
}
