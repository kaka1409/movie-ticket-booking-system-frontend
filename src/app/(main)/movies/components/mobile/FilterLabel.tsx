"use client";

export default function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-(--color-gold)">
      {children}
    </p>
  );
}
