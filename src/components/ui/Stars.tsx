import { Star } from "lucide-react";

/**
 * Star row for the 1–10 review scale. `rating` can be fractional (an 8.6
 * average fills 60% of the ninth star), so each star is a clipped overlay
 * rather than a rounded on/off switch.
 */
export default function Stars({
  rating,
  max = 10,
  size = 14,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, index) => {
        const fill = Math.min(Math.max(rating - index, 0), 1) * 100;

        return (
          <span key={index} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0 text-(--color-border) fill-(--color-border)"
            />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
              <Star size={size} className="text-(--color-gold) fill-(--color-gold)" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
