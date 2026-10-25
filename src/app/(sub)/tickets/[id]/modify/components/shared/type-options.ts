import { Armchair, ArrowUpRight, CalendarDays } from "lucide-react";
import type { ModificationType } from "@/features/tickets/types";

export interface ModifyTypeOption {
  type: ModificationType;
  icon: typeof CalendarDays;
  labelKey: string;
  descKey: string;
}

/** The three kinds of change, in the order both device skins list them. */
export const MODIFY_TYPE_OPTIONS: ModifyTypeOption[] = [
  {
    type: "showtime",
    icon: CalendarDays,
    labelKey: "tickets.modify.change_showtime",
    descKey: "tickets.modify.change_showtime_desc",
  },
  {
    type: "seats",
    icon: Armchair,
    labelKey: "tickets.modify.change_seats",
    descKey: "tickets.modify.change_seats_desc",
  },
  {
    type: "both",
    icon: ArrowUpRight,
    labelKey: "tickets.modify.change_both",
    descKey: "tickets.modify.change_both_desc",
  },
];
