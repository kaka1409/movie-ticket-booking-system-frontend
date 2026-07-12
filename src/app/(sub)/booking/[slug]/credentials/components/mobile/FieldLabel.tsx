"use client";

export default function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-(--color-text-muted) mb-1.5">
      {children}
    </p>
  );
}
