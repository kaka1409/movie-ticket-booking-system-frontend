"use client";

export default function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-white font-bold text-sm",
  labelClass,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  labelClass?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className={`flex items-center gap-1.5 text-[9px] font-black tracking-[0.16em] uppercase text-white/60 ${labelClass ?? ""}`}>
        <Icon size={10} />
        {label}
      </p>
      <div className={valueClass}>{value}</div>
    </div>
  );
}
