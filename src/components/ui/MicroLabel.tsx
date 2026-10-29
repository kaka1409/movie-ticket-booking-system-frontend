import type { ReactNode } from "react";

export default function MicroLabel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`text-3xs font-black tracking-[0.16em] uppercase ${className}`}>{children}</p>
  );
}
