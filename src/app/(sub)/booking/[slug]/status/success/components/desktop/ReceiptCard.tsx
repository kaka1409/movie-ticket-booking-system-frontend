"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useMounted } from "@/hooks/useMounted";
import { useLocale } from "@/contexts/LocaleContext";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import DetailRow from "@/app/(sub)/booking/components/mobile/DetailRow";
import PriceBreakdown from "@/app/(sub)/booking/components/mobile/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail } from "@/features/booking/types";

/**
 * Desktop receipt for a paid booking: movie identity, theater/day and the seats
 * → snacks → total breakdown on one wide card. The scan payload and the actions
 * live in the side panel, so this card stays purely the order.
 */
export default function ReceiptCard({
  movie,
  booking,
}: {
  movie: Movie | undefined;
  /** Authoritative booking payload when the page was reached with `?bookingId=`. */
  booking: BookingDetail | null;
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
  const { posterSrc, title, ageRating } = resolveTicketIdentity(movie, booking);

  return (
    <div
      className={`overflow-visible rounded-2xl border border-(--color-border) bg-(--color-surface) shadow-(--shadow-card) transition-all duration-700 delay-300 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {/* Movie identity */}
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
            <span className="mt-3 inline-block rounded-md border border-(--color-border) bg-(--color-surface-2) px-2.5 py-0.5 text-[10px] font-bold text-(--color-text-secondary)">
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
