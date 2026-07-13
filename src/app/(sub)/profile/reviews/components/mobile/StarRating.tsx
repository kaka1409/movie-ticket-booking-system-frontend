import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1) * 100;
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <Star
              className="absolute inset-0 h-4 w-4 text-(--color-gold)"
              strokeWidth={1.5}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <Star
                className="h-4 w-4 text-(--color-gold) fill-(--color-gold)"
                strokeWidth={1.5}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
