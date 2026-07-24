import type { ReactNode } from "react";

type SectionHeaderVariant = "borderLeft" | "goldBar" | "uppercase";

export default function SectionHeader({
  variant = "borderLeft",
  action,
  children,
}: {
  variant?: SectionHeaderVariant;
  action?: ReactNode;
  children: ReactNode;
}) {
  if (variant === "goldBar") {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-(--color-text-primary) font-bold text-base flex items-center gap-2">
          <span className="inline-block w-1 h-5 rounded-full bg-(--color-gold)" />
          {children}
        </h2>
        {action}
      </div>
    );
  }

  if (variant === "uppercase") {
    return (
      <p className="px-4 text-xs font-bold tracking-widest uppercase text-(--color-gold-dark)">
        {children}
      </p>
    );
  }

  return (
    <div className="mb-3 pl-1 flex items-center justify-between border-l-4 border-(--color-gold) rounded-(--radius-xs)">
      <h2 className="text-lg font-bold text-white">{children}</h2>
      {action}
    </div>
  );
}
