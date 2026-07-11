"use client";

export default function Legend() {
  return (
    <div className="px-4 flex flex-col items-center gap-x-5 gap-y-2">
      <div className="flex justify-between w-full">
        <LegendItem color="bg-(--color-surface-2) border border-(--color-border)" label="Available" />
        <LegendItem color="bg-(--color-gold)" label="Selected" />
        <LegendItem color="bg-(--color-surface-2) border border-(--color-border)" label="Occupied" icon="×" />
      </div>
      <div className="flex justify-center gap-20 w-full">
        <LegendItem color="bg-amber-700" label="VIP" />
        <LegendItem color="bg-pink-500" label="SweetBox" />
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  icon,
}: {
  color: string;
  label: string;
  icon?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-(--color-text-muted) ${color}`}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-(--color-text-secondary)">
        {label}
      </span>
    </div>
  );
}
