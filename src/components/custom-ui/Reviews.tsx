"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import StarRating from "./StarRating";

interface ReviewProps {
  productId: string;
  initialCanLeaveReview: boolean;
  userId?: string;
  orderId?: string;
}

const Reviews = ({
  productId,
  initialCanLeaveReview,
  userId,
  orderId,
}: ReviewProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canLeaveReview, setCanLeaveReview] = useState(initialCanLeaveReview);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchAllReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const allReviews = await res.json();
        console.log("All Reviews", allReviews);
        setReviews(allReviews);

        // Check if the user has already submitted a review
        const userHasReviewed = allReviews.some(
          (review: any) => review.customer._id === userId
        );
        setCanLeaveReview(initialCanLeaveReview && !userHasReviewed);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error in fetching Reviews", error);
    } finally {
      setIsLoading(false);
    }
  }, [initialCanLeaveReview, productId, userId]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  //  review form submission (for both creating and updating a review)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editMode
      ? `/api/reviews/${productId}` // PATCH
      : `/api/reviews/${productId}`; // POST

    const method = editMode ? "PATCH" : "POST";
    const body = editMode
      ? JSON.stringify({
          reviewId: editingReviewId,
          comment: reviewText,
          rating,
          orderId,
        })
      : JSON.stringify({ comment: reviewText, rating, userId, orderId });

    console.log("Product ID being used in fetch:", productId);
    console.log("Order ID used in fetch:", orderId);

    try {
      const res = await fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setReviewText("");
        setRating(0);
        setEditMode(false);
        setEditingReviewId(null);
        setCanLeaveReview(false);

        await fetchAllReviews();

        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("An error occurred, Please try again.");
    }
  };

  // delete review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "DELETE",
        body: JSON.stringify({ reviewId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchAllReviews();
        setCanLeaveReview(true); // Allow user to leave a new review after deletion
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("An error occurred, Please try again.");
    }
  };

  // Populate form for editing an existing review
  const handleEditReview = async (
    reviewId: string,
    comment: string,
    rating: number
  ) => {
    setEditMode(true);
    setEditingReviewId(reviewId);
    setReviewText(comment);
    setRating(rating);
    setCanLeaveReview(true);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div id="review-section">
      {canLeaveReview && (
        <form
          onSubmit={handleReviewSubmit}
          className=" flex flex-col gap-6 max-w-xl "
        >
          <h3 className="">
            {editMode ? "Edit the Review" : "Post the Review"}
          </h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write Your Review Here"
            rows={5}
            className="max-w-xl rounded-lg border "
          />
          <StarRating
            onRatingChange={handleRatingChange}
            initialRating={rating}
          />
          <button
            type="submit"
            className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3"
          >
            {editMode ? "Update Review" : "Submit Your Review"}
          </button>
        </form>
      )}

      {/* display  reviews here */}
      <div>
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div key={review._id} className="review-item">
              <p>{review.customer.name}</p>
              <p>{review.comment}</p>
              <p>Rating: {review.rating}</p>

              {/* Only allow review owner to edit or delete their own reviews */}
              {review.customer._id === userId && (
                <div>
                  <button
                    onClick={() =>
                      handleEditReview(
                        review._id,
                        review.comment,
                        review.rating
                      )
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet for this product.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
