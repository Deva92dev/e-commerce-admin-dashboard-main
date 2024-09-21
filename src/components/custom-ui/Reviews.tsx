/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import StarRating from "./StarRating";
import { ReviewType } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";

interface ReviewProps {
  productId: string;
  initialCanLeaveReview: boolean;
  userProfileImage?: string;
  userName?: string;
  userId?: string;
  orderId?: string;
}

const Reviews = ({
  productId,
  initialCanLeaveReview,
  userId,
  orderId,
  userName,
  userProfileImage,
}: ReviewProps) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [reviewTextPost, setReviewTextPost] = useState("");
  const [ratingPost, setRatingPost] = useState(0);
  const [reviewTextEdit, setReviewTextEdit] = useState("");
  const [ratingEdit, setRatingEdit] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canLeaveReview, setCanLeaveReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const fetchAllReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const allReviews: ReviewType[] = await res.json();
        console.log("All Reviews", allReviews);
        setReviews(allReviews);

        // Check if the user has already submitted a review
        const userReview = allReviews.find(
          (review: ReviewType) => review.customer.clerkId === userId
        );
        if (userReview) {
          setEditingReviewId(userReview._id);
          setReviewTextEdit(userReview.comment);
          setRatingEdit(userReview.rating);
          setCanLeaveReview(false);
        } else {
          setEditingReviewId(null);
          setReviewTextEdit("");
          setRatingEdit(0);
          // User can leave a review only if they have an order
          setCanLeaveReview(!!orderId);
        }
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error in fetching Reviews", error);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, productId, userId]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      setError("You must have an order to leave a review.");
      return;
    }

    const url = `/api/reviews/${productId}`;
    const method = "POST";

    const body = JSON.stringify({
      comment: reviewTextPost,
      rating: ratingPost,
      userId,
      orderId,
    });

    try {
      const res = await fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setReviewTextPost("");
        setRatingPost(0);
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

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      setError("You must have an order to update a review.");
      return;
    }

    const url = `/api/reviews/${productId}`;
    const method = "PATCH";

    const body = JSON.stringify({
      reviewId: editingReviewId,
      comment: reviewTextEdit,
      rating: ratingEdit,
      orderId,
    });

    try {
      const res = await fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setReviewTextEdit("");
        setRatingEdit(0);
        setEditMode(false);
        setEditingReviewId(null);
        await fetchAllReviews();
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setError("An error occurred, Please try again.");
    }
  };

  // delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!orderId) {
      setError("You must have an order to delete a review.");
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "DELETE",
        body: JSON.stringify({ reviewId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setEditMode(false);
        setEditingReviewId(null);
        setReviewTextEdit("");
        setRatingEdit(0);
        await fetchAllReviews();
        setCanLeaveReview(true);
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

  const handleRatingChangePost = (newRating: number) => {
    setRatingPost(newRating);
  };

  const handleRatingChangeEdit = (newRating: number) => {
    setRatingEdit(newRating);
  };

  const handleEditClick = (reviewId: string) => {
    const reviewToEdit = reviews.find((review) => review._id === reviewId);
    if (reviewToEdit) {
      setEditMode(true);
      setEditingReviewId(reviewId);
      setReviewTextEdit(reviewToEdit.comment);
      setRatingEdit(reviewToEdit.rating);
    }
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div>
      {canLeaveReview && !editMode && (
        <form
          onSubmit={handleReviewSubmit}
          className=" flex flex-col gap-6 max-w-xl mb-4"
        >
          <h3>Post Your Review</h3>
          <textarea
            value={reviewTextPost}
            onChange={(e) => setReviewTextPost(e.target.value)}
            placeholder="Write Your Review Here"
            rows={5}
            className="max-w-xl rounded-lg border"
          />
          <StarRating
            onRatingChange={handleRatingChangePost}
            initialRating={ratingPost}
          />
          <button
            type="submit"
            className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3"
          >
            Post Review
          </button>
        </form>
      )}

      {editMode && editingReviewId && (
        <form
          onSubmit={handleUpdateReview}
          className=" flex flex-col gap-6 max-w-xl mb-4"
        >
          <h3>Edit Your Review</h3>
          <textarea
            value={reviewTextEdit}
            onChange={(e) => setReviewTextEdit(e.target.value)}
            placeholder="Edit Your Review Here"
            rows={5}
            className="max-w-xl rounded-lg border"
          />
          <StarRating
            onRatingChange={handleRatingChangeEdit}
            initialRating={ratingEdit}
          />
          <button
            type="submit"
            className="w-full text-center outline bg-black text-white hover:bg-blue-400 text-base font-bold rounded-lg px-2 py-3"
          >
            Update Review
          </button>
        </form>
      )}

      {/* display  reviews here */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {reviews.length > 0 ? (
          reviews.map((review: ReviewType) =>
            review.customer.clerkId !== userId ? (
              // Show all other users' reviews
              <div key={review._id} className="border p-4 rounded-xl">
                <div className="flex flex-row items-center gap-4">
                  <img
                    src={userProfileImage}
                    alt="user icon"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <p>{review.customer.name}</p>
                    <StarRating initialRating={review.rating} readonly={true} />
                  </div>
                </div>
                <p className="mt-4">{review.comment}</p>
              </div>
            ) : (
              // Show the user's own review with edit and delete options
              <div key={review._id} className="border p-4 rounded-xl">
                <div className="flex flex-row items-center gap-4">
                  <img
                    src={userProfileImage}
                    alt="user icon"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <p>{review.customer.name}</p>
                    <StarRating initialRating={review.rating} readonly={true} />
                  </div>
                </div>
                <p className="mt-4">{review.comment}</p>
                <div className="my-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEditClick(review._id)}
                  >
                    <Edit />
                  </button>
                  <button
                    className="text-red-600 ml-4"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            )
          )
        ) : (
          <p>No reviews yet for this product.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
