"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import { createContactSchema } from "@/features/booking/schema";
import BookingBottomBar from "@/components/shared/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { total, contactName, contactEmail, contactPhone } = useBooking();
  const { translate } = useLocale();

  // The contact draft in BookingContext is the same data ContactForm validates.
  const isValid = useMemo(() => {
    const schema = createContactSchema(translate);
    return schema.safeParse({ name: contactName, email: contactEmail, phone: contactPhone })
      .success;
  }, [translate, contactName, contactEmail, contactPhone]);

  return (
    <BookingBottomBar
      totalInfo={{
        label: translate("booking.common.total"),
        amount: total,
      }}
      canProceed={isValid}
      ctaText={translate("booking.credentials.continue_payment")}
      ctaHref={`/booking/${slug}/payment`}
    />
  );
}
