"use client";
import { Star } from "lucide-react";
import React, { useState } from "react";

interface StarRatingProps {
  maxRating?: number;
  initialRating?: number;
  onRatingChange: (rating: number) => void;
}

const StarRating = ({
  maxRating = 5,
  initialRating = 0,
  onRatingChange,
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onRatingChange(newRating);
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
            size={24}
            onClick={() => handleRatingChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            fill={ratingValue <= (hover || rating) ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
