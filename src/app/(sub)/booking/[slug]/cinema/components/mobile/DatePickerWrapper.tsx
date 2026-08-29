"use client";

import { useCinemaSelection } from "@/features/booking/contexts/CinemaSelectionContext";
import DatePicker from "@/components/ui/DatePicker";

export default function DatePickerWrapper() {
  const { dates, selectedDate, setSelectedDate } = useCinemaSelection();
  return (
    <DatePicker
      dates={dates}
      selected={selectedDate}
      onSelect={setSelectedDate}
    />
  );
}
