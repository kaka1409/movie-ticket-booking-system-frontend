"use client";

import Image from "next/image";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import Badge from "@/components/ui/Badge";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import { paymentErrorCode } from "@/features/booking/utils/paymentFailure";
import { MonitorPlay, CalendarDays } from "lucide-react";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

export default function FailedOrderCard({
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

  const errorCode = paymentErrorCode(reason);

  return (
    <div
      className={`mx-4 rounded-3xl overflow-visible bg-(--color-surface) border border-red-500/20 shadow-[0_0_0_1px_rgba(239,68,68,0.06)] transition duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex gap-3 p-4">
        {posterSrc && (
          <div className="w-20 h-30 flex-shrink-0 rounded-sm overflow-hidden relative opacity-70">
            <Image
              src={posterSrc}
              alt={title}
              width={80}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-base text-white mb-1">{title}</h3>
          <p className="text-xs text-white/60 mb-2">{ageRating}</p>
        </div>
      </div>

      <TearLine lineClassName="mx-3" />

      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between gap-4">
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
            value={cardData ? cardData.dateTime : `${date} • ${time}`}
            valueClass="font-bold text-sm text-white text-right"
            labelClass="justify-end"
          />
        </div>

        <PriceBreakdown
          seats={cardData?.seats ?? selectedSeats}
          snacks={cardData?.snacks ?? [...combos, ...foods]}
          paymentMethod={cardData?.paymentMethod ?? paymentMethod}
          total={cardData?.total ?? total}
          totalClassName="text-white"
        />

        <div className="flex items-center gap-2 pt-1">
          <Badge
            variant="error"
            size="xs"
            className="bg-red-500/10 text-red-400 border border-red-500/20"
          >
            {errorCode}
          </Badge>
          <span className="text-2xs text-white/60">
            {translate("booking.status.failed.card_not_charged")}
          </span>
        </div>
      </div>

      <TearLine lineClassName="mx-3" />
    </div>
  );
}
