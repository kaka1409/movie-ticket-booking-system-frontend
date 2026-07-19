function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-(--color-surface-2) ${className}`}
      {...props}
    />
  );
}

function SkeletonCircle({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      className={`rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function SkeletonText({
  lines = 3,
  widths,
  className = "",
}: {
  lines?: number;
  widths?: string[];
  className?: string;
}) {
  const defaultWidths = ["100%", "85%", "60%"];
  const resolved = widths ?? defaultWidths;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-3 rounded-(--radius-sm)"
          style={{ width: resolved[index % resolved.length] }}
        />
      ))}
    </div>
  );
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

export { Skeleton, SkeletonCircle, SkeletonText, SkeletonCard };
