import { Star } from "lucide-react";

export default function Stars({
  rating,
  max = 5,
  size = 14,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "text-(--color-gold) fill-(--color-gold)"
              : "text-(--color-border) fill-(--color-border)"
          }
        />
      ))}
    </span>
  );
}
