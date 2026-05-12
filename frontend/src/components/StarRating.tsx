import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
}

const sizeMap = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
};

export const StarRating = ({ rating, max = 5, size = "md", showValue = false }: StarRatingProps) => {
    const rounded = Math.round(rating);
    const iconClass = sizeMap[size];

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }).map((_, i) => (
                    <Star
                        key={i}
                        className={`${iconClass} transition-colors ${
                            i < rounded ? "fill-accent text-accent" : "text-muted-foreground/30"
                        }`}
                    />
                ))}
            </div>
            {showValue ? (
                <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)}</span>
            ) : null}
        </div>
    );
};
