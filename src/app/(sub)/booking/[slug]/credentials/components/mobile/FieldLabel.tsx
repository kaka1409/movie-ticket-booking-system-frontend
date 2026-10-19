"use client";

export default function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-bold tracking-[0.16em] uppercase text-(--color-text-muted) mb-1.5"
    >
      {children}
    </label>
  );
}
