"use client";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

interface StarRatingProps {
  maxRating?: number;
  initialRating?: number;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating = ({
  maxRating = 5,
  initialRating = 0,
  onRatingChange,
  readonly = false,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingChange = (newRating: number) => {
    if (!readonly && onRatingChange) {
      setRating(newRating);
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            className={`cursor-pointer ${
              ratingValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            size={16}
            onClick={() => !readonly && handleRatingChange(ratingValue)}
            onMouseEnter={() => !readonly && setHover(ratingValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            fill={ratingValue <= (hover || rating) ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
