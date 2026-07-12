import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
}

function StarRating({ rating, reviews, size = "sm" }: StarRatingProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${iconSize} ${
              i < Math.round(rating) ? "fill-mustard-500 text-mustard-500" : "fill-forest-900/10 text-forest-900/10"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-forest-800">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-xs text-forest-700/40">({reviews})</span>
      )}
    </div>
  );
}

export default StarRating;
