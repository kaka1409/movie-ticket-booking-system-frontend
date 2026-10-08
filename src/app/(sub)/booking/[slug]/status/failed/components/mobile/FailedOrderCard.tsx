"use client";

import Image from "next/image";
import { useBooking } from "@/features/booking/context";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import Badge from "@/components/ui/Badge";
import { bookingCardData } from "@/features/booking/utils/bookingCard";
import { MonitorPlay, CalendarDays } from "lucide-react";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail } from "@/features/booking/types";

const ERROR_CODES: Record<string, string> = {
  payment_declined: "ERR_PAYMENT_DECLINED",
  insufficient_funds: "ERR_INSUFFICIENT_FUNDS",
  network_error: "ERR_NETWORK",
  expired_card: "ERR_CARD_EXPIRED",
};

export default function FailedOrderCard({
  movie,
  booking,
  reason,
}: {
  movie: Movie | undefined;
  /** Authoritative booking payload when the page was reached with `?bookingId=`. */
  booking: BookingDetail | null;
  reason: string | null;
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

  // `?bookingId=` payload is authoritative; the BookingContext draft covers
  // direct links / mock-era URLs without one.
  const cardData = booking ? bookingCardData(booking) : null;
  const posterSrc = movie?.src ?? booking?.showtime.movie.posterUrl ?? null;
  const title = movie?.title ?? booking?.showtime.movie.title ?? "N/A";
  const ageRating = movie?.ageRating ?? booking?.showtime.movie.ageRating;

  const errorCode = ERROR_CODES[reason ?? ""] ?? "ERR_UNKNOWN";

  return (
    <div
      className={`mx-4 rounded-3xl overflow-visible bg-(--color-surface) border border-red-500/20 shadow-[0_0_0_1px_rgba(239,68,68,0.06)] transition-all duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* Top: movie info */}
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

      {/* Tear line */}
      <TearLine lineClassName="mx-3" />

      {/* Booking details */}
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

        {/* Error code pill */}
        <div className="flex items-center gap-2 pt-1">
          <Badge
            variant="error"
            size="xs"
            className="bg-red-500/10 text-red-400 border border-red-500/20"
          >
            {errorCode}
          </Badge>
          <span className="text-[10px] text-white/60">
            {translate("booking.status.failed.card_not_charged")}
          </span>
        </div>
      </div>

      {/* Tear line */}
      <TearLine lineClassName="mx-3" />
    </div>
  );
}
