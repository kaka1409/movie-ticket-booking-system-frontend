"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

/**
 * Order receipt for a created booking: movie identity, theater/day and the
 * seats → snacks → total breakdown on one wide card. Both the success page and
 * the QR page render it, so the order never changes shape mid-payment.
 */
export default function ReceiptCard({
  movie,
  booking,
  paymentMethods,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  paymentMethods: PaymentMethodOption[];
}) {
  const {
    cinemaName,
    room,
    location,
    date,
    time,
    selectedSeats,
    paymentMethod,
    combos,
    foods,
    total,
  } = useBooking();
  const mounted = useMounted();
  const { translate } = useLocale();

  const cardData = booking ? bookingCardData(booking, paymentMethods) : null;
  const { posterSrc, title, ageRating } = resolveTicketIdentity(movie, booking);

  return (
    <div
      className={`overflow-visible rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) transition duration-700 delay-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="flex gap-5 p-6">
        {posterSrc && (
          <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-md bg-(--color-surface-2)">
            <Image src={posterSrc} alt={title} fill sizes="96px" className="object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl leading-snug font-extrabold text-(--color-text-primary)">
            {title}
          </h2>
          {ageRating && (
            <span className="mt-3 inline-block rounded-md border border-(--color-border) bg-(--color-surface-2) px-2.5 py-0.5 text-2xs font-bold text-(--color-text-secondary)">
              {ageRating}
            </span>
          )}
        </div>
      </div>

      <TearLine lineClassName="mx-5" />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-6">
          <DetailRow
            icon={MonitorPlay}
            label={translate("booking.common.theater")}
            value={
              cardData ? (
                cardData.theater
              ) : (
                <>
                  {cinemaName}
                  {room && <>, {room}</>}
                  {location && <>, {location}</>}
                </>
              )
            }
          />
          <DetailRow
            icon={CalendarDays}
            label={translate("booking.common.date_time")}
            value={cardData ? cardData.dateTime : `${date}  ${time}`}
          />
        </div>

        <div className="border-t border-(--color-border) pt-6">
          <PriceBreakdown
            seats={cardData?.seats ?? selectedSeats}
            snacks={cardData?.snacks ?? [...combos, ...foods]}
            paymentMethod={cardData?.paymentMethod ?? paymentMethod}
            total={cardData?.total ?? total}
          />
        </div>
      </div>
    </div>
  );
}
