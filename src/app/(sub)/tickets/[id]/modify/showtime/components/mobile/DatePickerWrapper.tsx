"use client";

import { useModification } from "@/features/tickets/contexts/ModificationContext";
import DatePicker from "@/features/showtimes/components/DatePicker";

export default function DatePickerWrapper() {
  const { dates, selectedDate, setSelectedDate } = useModification();

  if (dates.length === 0) return null;

  return <DatePicker dates={dates} selected={selectedDate} onSelect={setSelectedDate} />;
}
