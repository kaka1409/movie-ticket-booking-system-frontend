"use client";

import MicroLabel from "@/components/ui/MicroLabel";

export default function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-(--color-text-primary)",
  labelClass,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  labelClass?: string;
}) {
  return (
    <div className="space-y-1">
      <MicroLabel className={`flex items-center gap-1.5 text-white/60 ${labelClass ?? ""}`}>
        <Icon size={10} />
        {label}
      </MicroLabel>
      <div className={`font-bold text-sm leading-snug ${valueClass}`}>{value}</div>
    </div>
  );
}
