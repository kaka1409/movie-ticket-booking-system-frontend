"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/contexts/BookingContext";
import { useLocale } from "@/contexts/LocaleContext";
import { getBackHref } from "../utils";

/** Booking-only back control; it carries the chosen showtime through the URL. */
export default function BookingBackButton({ pathname }: { pathname: string }) {
  const router = useRouter();
  const { translate } = useLocale();
  const { showtimeId, cinemaId, time, date } = useBooking();
  const backHref = getBackHref(pathname, { showtimeId, cinemaId, time, date });

  if (!backHref) return <div className="w-9 h-9" />;

  return (
    <button
      type="button"
      onClick={() => router.replace(backHref)}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-(--color-surface) transition-colors"
      aria-label={translate("layout.sub.back")}
    >
      <ArrowLeft size={22} className="text-(--color-gold-light)" />
    </button>
  );
}
