"use client";

import Image from "next/image";
import { CalendarDays, MonitorPlay } from "lucide-react";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import QRCode from "@/components/shared/tickets/QRCode";
import TearLine from "@/components/ui/TearLine";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

/**
 * Ticket-styled capture card for the success page download: same layout as the
 * `/tickets/[id]` `TicketCapture` (poster hero → details → QR), but fed by the
 * booking draft / `GET /bookings/:id` payload since no ticket row exists yet.
 * Rendered off-screen by the success section — never seen on screen.
 */
export default function TicketCaptureCard({
  movie,
  booking,
  transactionId,
  paymentMethods,
}: {
  movie: Movie | undefined;
  booking: BookingDetail | null;
  transactionId: string;
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
  const { translate, locale } = useLocale();

  const cardData = booking ? bookingCardData(booking, paymentMethods, locale) : null;
  const { posterSrc, title, ageRating } = resolveTicketIdentity(movie, booking);
  const format = booking?.showtime.format;
  const qrRef = booking?.id ?? transactionId;

  return (
    <div
      id="success-ticket-capture"
      className="w-[400px] rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-xl"
    >
      <div className="relative h-80 w-full overflow-hidden bg-(--color-surface)">
        {posterSrc && (
          <Image src={posterSrc} alt={title} fill sizes="400px" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
          <div className="mb-1.5 flex items-center gap-2">
            {format && (
              <span className="rounded-full border border-(--color-border) bg-black/80 px-2.5 py-1 text-2xs font-bold text-(--color-text-secondary)">
                {format}
              </span>
            )}
            {ageRating && (
              <span className="rounded-full border border-(--color-border) bg-black/80 px-2.5 py-1 text-2xs font-bold text-(--color-text-secondary)">
                {ageRating}
              </span>
            )}
          </div>
          <h2 className="text-2xl leading-tight font-extrabold text-white">{title}</h2>
        </div>
      </div>

      <TearLine className="mx-0 my-0" lineClassName="mx-6" />

      <div className="space-y-4 px-6 py-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
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
            valueClass="text-right text-sm font-bold whitespace-nowrap text-white"
            labelClass="justify-end"
          />
        </div>

        <PriceBreakdown
          seats={cardData?.seats ?? selectedSeats}
          snacks={cardData?.snacks ?? [...combos, ...foods]}
          paymentMethod={cardData?.paymentMethod ?? paymentMethod}
          total={cardData?.total ?? total}
        />
      </div>

      <TearLine className="mx-0 my-0" lineClassName="mx-6" />

      <div className="flex flex-col items-center gap-3 px-6 pt-4 pb-6">
        <QRCode value={qrRef} />
        <p className="text-xs tracking-wide text-white/60">
          {translate("booking.status.success.booking_id")}
          <span className="font-bold text-white">#{cardData?.bookingRef ?? transactionId}</span>
        </p>
      </div>
    </div>
  );
}
