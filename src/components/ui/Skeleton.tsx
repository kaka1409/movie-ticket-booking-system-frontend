function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-(--color-surface-2) ${className}`} {...props} />;
}

function SkeletonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export { Skeleton, SkeletonCard };
