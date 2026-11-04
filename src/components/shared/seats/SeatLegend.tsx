"use client";

import { useLocale } from "@/contexts/LocaleContext";

function LegendItem({ color, label, icon, desktop }: { color: string; label: string; icon?: string; desktop?: boolean }) {
  if (desktop) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-surface-2) hover:bg-(--color-surface-3) transition-colors cursor-default">
        <div
          className={`w-5 h-5 rounded-sm flex items-center justify-center text-2xs font-bold text-(--color-text-muted) ${color}`}
        >
          {icon}
        </div>
        <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-sm flex items-center justify-center text-2xs font-bold text-(--color-text-muted) ${color}`}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-(--color-text-secondary)">{label}</span>
    </div>
  );
}

export default function SeatLegend({ showSweetbox = true, desktop = false }: { showSweetbox?: boolean; desktop?: boolean }) {
  const { translate } = useLocale();

  if (desktop) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs text-(--color-text-muted)">
          {translate("booking.seats.legend_hint")}
        </span>
        <div className="flex flex-row items-center gap-3 flex-wrap">
          <LegendItem
            color="bg-(--color-surface-2) border border-(--color-border)"
            label={translate("booking.seats.available")}
            desktop
          />
          <LegendItem color="bg-(--color-gold)" label={translate("booking.seats.selected")} desktop />
          <LegendItem
            color="bg-(--color-surface-2) border border-(--color-border)"
            label={translate("booking.seats.occupied")}
            icon="×"
            desktop
          />
          <LegendItem color="bg-amber-700" label={translate("booking.seats.vip")} desktop />
          {showSweetbox && (
            <LegendItem color="bg-pink-500" label={translate("booking.seats.sweetbox")} desktop />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col items-center gap-x-5 gap-y-2">
      <div className="flex justify-between w-full">
        <LegendItem
          color="bg-(--color-surface-2) border border-(--color-border)"
          label={translate("booking.seats.available")}
        />
        <LegendItem color="bg-(--color-gold)" label={translate("booking.seats.selected")} />
        <LegendItem
          color="bg-(--color-surface-2) border border-(--color-border)"
          label={translate("booking.seats.occupied")}
          icon="×"
        />
      </div>
      <div className="flex justify-center gap-20 w-full">
        <LegendItem color="bg-amber-700" label={translate("booking.seats.vip")} />
        {showSweetbox && (
          <LegendItem color="bg-pink-500" label={translate("booking.seats.sweetbox")} />
        )}
      </div>
    </div>
  );
}
