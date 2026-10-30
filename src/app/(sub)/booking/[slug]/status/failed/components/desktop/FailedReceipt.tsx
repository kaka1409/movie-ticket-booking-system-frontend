"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import { paymentErrorCode } from "@/features/booking/utils/paymentFailure";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import Badge from "@/components/ui/Badge";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

/**
 * Desktop receipt for a failed payment: same wide shape as the success receipt
 * but with the red-tinted border, the gateway error code and the reassurance
 * that nothing was charged.
 */
export default function FailedReceipt({
  movie,
  booking,
  reason,
  paymentMethods,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  reason: string | null;
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
      className={`overflow-visible rounded-2xl border border-red-500/20 bg-(--color-surface) shadow-[0_0_0_1px_rgba(239,68,68,0.06)] transition duration-700 delay-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="flex gap-5 p-6">
        {posterSrc && (
          <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-md bg-(--color-surface-2) opacity-70">
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
            totalClassName="text-(--color-text-primary)"
          />
        </div>

        <div className="flex items-center gap-2 border-t border-(--color-border) pt-5">
          <Badge
            variant="error"
            size="xs"
            className="border border-red-500/20 bg-red-500/10 text-red-400"
          >
            {paymentErrorCode(reason)}
          </Badge>
          <span className="text-2xs text-(--color-text-muted)">
            {translate("booking.status.failed.card_not_charged")}
          </span>
        </div>
      </div>
    </div>
  );
}
