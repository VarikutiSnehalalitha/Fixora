import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showText = false
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = rating >= starNumber;
          const isPartiallyFilled = rating > index && rating < starNumber;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starNumber)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'text-[#D99119] fill-[#D99119]'
                    : isPartiallyFilled
                    ? 'text-[#D99119] fill-[#D99119]/50'
                    : 'text-[#E6E8E5]'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-[#252B2B] ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
