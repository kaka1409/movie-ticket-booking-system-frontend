"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useBooking } from "@/features/booking/context";
import { useMounted } from "@/hooks/useMounted";
import { bookingCardData, resolveTicketIdentity } from "@/features/booking/utils/bookingCard";
import { useLocale } from "@/contexts/LocaleContext";
import DetailRow from "@/components/shared/DetailRow";
import PriceBreakdown from "@/components/shared/PriceBreakdown";
import TearLine from "@/components/ui/TearLine";
import { MonitorPlay, CalendarDays } from "lucide-react";
import type { Movie } from "@/features/movies/types";
import type { BookingDetail, PaymentMethodOption } from "@/features/booking/types";

export default function TicketCard({
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
  const mounted = useMounted();
  const { translate } = useLocale();

  const cardData = booking ? bookingCardData(booking, paymentMethods) : null;
  const { posterSrc, title, ageRating } = resolveTicketIdentity(movie, booking);
  const bookingRef = cardData?.bookingRef ?? transactionId;
  const qrValue = booking
    ? `https://primseat.com/tickets/${booking.id}`
    : `https://primseat.com/tickets/${transactionId}`;

  return (
    <div
      className={`mx-4 rounded-3xl overflow-visible bg-(--color-surface) border border-(--color-border) shadow-[--shadow-card] transition-all duration-700 delay-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex gap-3 p-4">
        {posterSrc && (
          <div className="w-20 h-30 flex-shrink-0 rounded-sm overflow-hidden relative">
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

      <TearLine className="px-0 my-0" lineClassName="mx-3" />

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
            value={cardData ? cardData.dateTime : `${date}  ${time}`}
            valueClass="text-white font-bold text-sm text-right"
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

      <TearLine className="px-0 my-0" lineClassName="mx-3" />

      <div className="px-4 pb-5 pt-4 flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-4 px-6 py-6 rounded-2xl bg-white">
          <QRCodeSVG value={qrValue} size={250} level="H" />
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
            {translate("booking.common.scan_enter")}
          </p>
        </div>
        <p className="text-xs text-white/60 tracking-wide">
          {translate("booking.status.success.booking_id")}
          <span className="font-bold text-white">#{bookingRef}</span>
        </p>
      </div>
    </div>
  );
}
