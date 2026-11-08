import { Star } from "lucide-react";

/**
 * Compact score for one review: a single gold star plus `8/10` instead of the
 * ten-icon row. The movie-level block keeps the full `Stars` row — it plots a
 * fractional average, this badge states an exact integer score.
 */
export default function RatingBadge({
  rating,
  max = 10,
  size = 12,
  className = "",
}: {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Star size={size} className="text-(--color-gold) fill-(--color-gold)" aria-hidden />
      <span className="text-xs font-bold text-(--color-text-muted) tabular-nums">
        {rating}/{max}
      </span>
    </span>
  );
}
