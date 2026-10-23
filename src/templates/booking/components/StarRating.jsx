import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  size = 18,
  readOnly = false,
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={`transition ${readOnly ? "cursor-default" : "hover:scale-110"}`}
          >
            <Star
              size={size}
              className={
                filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
