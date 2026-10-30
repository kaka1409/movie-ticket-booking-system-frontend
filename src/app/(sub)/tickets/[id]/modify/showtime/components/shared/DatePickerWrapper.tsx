"use client";

import { useModification } from "@/features/tickets/contexts/ModificationContext";
import DatePicker from "@/components/shared/showtimes/DatePicker";

/** Draft-bound date strip: no eligible day means nothing to pick. */
export default function DatePickerWrapper() {
  const { dates, selectedDate, setSelectedDate } = useModification();

  if (dates.length === 0) return null;

  return <DatePicker dates={dates} selected={selectedDate} onSelect={setSelectedDate} />;
}
