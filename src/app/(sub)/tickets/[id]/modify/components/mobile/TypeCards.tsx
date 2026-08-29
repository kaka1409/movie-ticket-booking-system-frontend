"use client";

import { CalendarDays, Armchair, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useModification } from "@/features/tickets/contexts/ModificationContext";
import type { ModificationType } from "@/features/tickets/types";

interface TypeOption {
  type: ModificationType;
  icon: typeof CalendarDays;
  labelKey: string;
  descKey: string;
}

const TYPES: TypeOption[] = [
  { type: "showtime", icon: CalendarDays, labelKey: "tickets.modify.change_showtime", descKey: "tickets.modify.change_showtime_desc" },
  { type: "seats", icon: Armchair, labelKey: "tickets.modify.change_seats", descKey: "tickets.modify.change_seats_desc" },
  { type: "both", icon: ArrowUpRight, labelKey: "tickets.modify.change_both", descKey: "tickets.modify.change_both_desc" },
];

export default function TypeCards() {
  const { translate } = useLocale();
  const { modificationType, setModificationType } = useModification();

  return (
    <section className="px-4 space-y-3">
      <p className="text-sm font-bold text-(--color-text-secondary) mb-4">
        {translate("tickets.modify.select_type")}
      </p>
      {TYPES.map(({ type, icon: Icon, labelKey, descKey }) => {
        const selected = modificationType === type;
        return (
          <button
            key={type}
            onClick={() => setModificationType(type)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-150 active:scale-[0.99] text-left ${
              selected
                ? "bg-(--color-surface) border-(--color-gold) shadow-[0_0_0_1px_rgba(255,204,77,0.12)]"
                : "bg-(--color-surface) border-(--color-border) hover:border-(--color-gold)/30"
            }`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${
                selected
                  ? "bg-(--color-gold)/10 text-(--color-gold)"
                  : "bg-(--color-surface-2) text-(--color-text-muted)"
              }`}
            >
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-bold text-sm ${
                  selected
                    ? "text-(--color-text-primary)"
                    : "text-(--color-text-secondary)"
                }`}
              >
                {translate(labelKey)}
              </p>
              <p className="text-xs text-(--color-text-muted) mt-0.5">
                {translate(descKey)}
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                selected
                  ? "border-(--color-gold) bg-(--color-gold)"
                  : "border-(--color-text-muted) bg-transparent"
              }`}
            >
              {selected && <div className="w-2 h-2 rounded-full bg-[#0F0F0F]" />}
            </div>
          </button>
        );
      })}
    </section>
  );
}
