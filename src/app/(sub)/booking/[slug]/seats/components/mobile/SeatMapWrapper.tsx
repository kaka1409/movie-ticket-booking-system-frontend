"use client";

import { useSeatSelection } from "@/features/booking/contexts/SeatSelectionContext";
import SeatGrid from "@/components/ui/SeatGrid";

export default function SeatMapWrapper() {
  const { rows, handleToggle } = useSeatSelection();
  return <SeatGrid rows={rows} onToggle={handleToggle} />;
}
