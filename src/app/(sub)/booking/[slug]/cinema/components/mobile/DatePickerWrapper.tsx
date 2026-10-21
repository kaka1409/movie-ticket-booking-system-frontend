"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBooking } from "@/features/booking/context";
import DatePicker from "@/features/showtimes/components/DatePicker";
import type { DateOption } from "@/features/booking/types";

export default function DatePickerWrapper({ dates }: { dates: DateOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { date: selectedDate, setCinemaDate } = useBooking();

  /* Picking another day clears the slot in the same reducer transition and
     re-renders the page server-side with that day's showtimes. */
  const setSelectedDate = useCallback(
    (nextDate: string) => {
      if (nextDate === selectedDate) return;

      setCinemaDate(nextDate);
      router.replace(`${pathname}?date=${nextDate}`, { scroll: false });
    },
    [pathname, router, selectedDate, setCinemaDate],
  );

  return <DatePicker dates={dates} selected={selectedDate} onSelect={setSelectedDate} />;
}
