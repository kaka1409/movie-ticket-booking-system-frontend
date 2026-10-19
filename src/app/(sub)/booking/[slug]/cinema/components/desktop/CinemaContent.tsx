"use client";

import { ArrowRight } from "lucide-react";
import { useBooking } from "@/features/booking/context";
import { useLocale } from "@/contexts/LocaleContext";
import Button from "@/components/ui/Button";
import MicroLabel from "@/components/ui/MicroLabel";
import BookingStepLayout from "@/app/(sub)/booking/components/desktop/BookingStepLayout";
import { buildSeatsHref } from "@/features/booking/utils/cinema";
import type { Cinema, DateOption } from "@/features/booking/types";
import DatePickerWrapper from "../mobile/DatePickerWrapper";
import SearchBarWrapper from "../mobile/SearchBar";
import CinemaList from "../mobile/CinemaList";

/**
 * Desktop cinema step: the pickers (day, search, cinema cards) in the content
 * column and the rail carrying the movie, the picked slot and the seats CTA.
 *
 * The slot state is the booking draft itself — the same source the mobile tree
 * and `CinemaAdopt` write, so the two skins cannot disagree.
 */
export default function CinemaContent({
  movieSlug,
  cinemas,
  dates,
}: {
  movieSlug: string;
  cinemas: Cinema[];
  dates: DateOption[];
}) {
  const { cinemaId, cinemaName, location, time, date, showtimeId, clearCinemaSlot } = useBooking();
  const { translate } = useLocale();

  const hasSelection = Boolean(cinemaName && time);

  return (
    <BookingStepLayout
      current={1}
      summary={
        hasSelection ? (
          <div className="space-y-4">
            <div>
              <MicroLabel className="text-(--color-text-muted)">
                {translate("booking.common.theater")}
              </MicroLabel>
              <p className="mt-1 text-sm font-bold text-(--color-text-primary)">{cinemaName}</p>
              {location && <p className="mt-0.5 text-xs text-(--color-text-muted)">{location}</p>}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <MicroLabel className="text-(--color-text-muted)">
                  {translate("booking.cinema.showtime")}
                </MicroLabel>
                <p className="mt-1 text-base font-extrabold text-(--color-gold)">{time}</p>
              </div>
              <button
                type="button"
                onClick={clearCinemaSlot}
                className="text-xs font-bold underline underline-offset-2 text-(--color-text-muted) transition-colors duration-150 hover:text-(--color-text-primary)"
              >
                {translate("common.clear_selection")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-(--color-text-muted)">
            {translate("booking.cinema.select_prompt")}
          </p>
        )
      }
      action={
        <Button
          href={
            hasSelection
              ? buildSeatsHref(movieSlug, { showtimeId, cinemaId, time, date })
              : undefined
          }
          disabled={!hasSelection}
          icon={ArrowRight}
        >
          {translate("booking.cinema.select_seats")}
        </Button>
      }
    >
      <div className="space-y-6">
        <h1 className="text-xl font-extrabold tracking-wide text-(--color-text-primary)">
          {translate("booking.cinema.title")}
        </h1>
        <DatePickerWrapper dates={dates} />
        <SearchBarWrapper className="" />
        <CinemaList cinemas={cinemas} />
      </div>
    </BookingStepLayout>
  );
}
