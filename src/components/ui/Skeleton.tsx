function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-(--color-surface-2) ${className}`} {...props} />;
}

/**
 * Skeleton for bars drawn *on top of* a `.surface-raised` panel. `Skeleton`
 * paints `--color-surface-2`, which is exactly what that scope re-points
 * `--color-surface` to, so a plain bar would vanish into the card it sits on; a
 * muted tint stays readable against both the lifted card and the panel behind it.
 */
function SkeletonBar({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={`animate-pulse bg-(--color-text-muted)/30 ${className}`} style={style} />;
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

export { Skeleton, SkeletonBar, SkeletonCard };
