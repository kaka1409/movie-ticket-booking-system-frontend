"use client";

import { useParams } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import { useCredentials } from "@/features/booking/contexts/CredentialsContext";
import { useLocale } from "@/contexts/LocaleContext";
import BookingBottomBar from "@/components/booking/BookingBottomBar";

export default function BottomBar() {
  const params = useParams();
  const slug = params.slug as string;
  const { total } = useBooking();
  const { isValid } = useCredentials();
  const { translate } = useLocale();

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
