import type { ReactNode } from "react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface)">
        <Icon size={28} className="text-(--color-text-muted)" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-(--color-text-primary)">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-(--color-text-muted)">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
