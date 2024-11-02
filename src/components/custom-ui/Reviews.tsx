/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { ReviewType } from "@/lib/types";
import { CircleUser, Edit, Trash2 } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { throttle } from "lodash";

// infinite scroll for reviews
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
  const [page, setPage] = useState(1); // tracks the current page
  const [hasMore, setHasMore] = useState(true); // Whether there are more reviews to load
  const [isFetching, setIsFetching] = useState(false); // Track fetching status
  const observer = useRef<IntersectionObserver | null>(null); // for infinite scroll
  const reviewsRef = useRef<ReviewType[]>([]); // Ref to hold the fetched reviews

  const router = useRouter();

  const debouncedReviewTextPost = useDebounce(reviewTextPost, 500);
  const debouncedReviewTextEdit = useDebounce(reviewTextEdit, 500);

  useEffect(() => {
    if (orderId) {
      setCanLeaveReview(true);
    }
  }, [orderId]);

  useEffect(() => {
    setPage(1);
    reviewsRef.current = [];
  }, [productId]);

  const fetchReviews = useCallback(
    async (pageNum: number) => {
      if (!hasMore || isFetching) return; // Prevent overlapping requests
      setIsFetching(true);
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/reviews/${productId}?page=${pageNum}&limit=10`
        );
        if (res.ok) {
          const { reviews: newReviews = [], totalReviews } = await res.json();

          // Update reviews by adding new ones while avoiding duplicates
          const updatedReviews = [
            ...reviewsRef.current,
            ...newReviews.filter(
              (newReview: ReviewType) =>
                !reviewsRef.current.some(
                  (review) => review._id === newReview._id
                )
            ),
          ];

          reviewsRef.current = updatedReviews;
          setReviews(updatedReviews);

          setHasMore(
            newReviews.length > 0 && updatedReviews.length < totalReviews
          );
          setPage(pageNum);

          // Check if the user has already submitted a review
          const userHasReviewed = updatedReviews.find(
            (review: ReviewType) => review.customer.clerkId === userId
          );
          if (userHasReviewed) {
            setEditingReviewId(userHasReviewed._id);
            setReviewTextEdit(userHasReviewed.comment);
            setRatingEdit(userHasReviewed.rating);
            setCanLeaveReview(false);
          } else {
            setEditingReviewId(null);
            setReviewTextEdit("");
            setRatingEdit(0);
            // User can leave a review only if they have an order
            setCanLeaveReview(Boolean(orderId) && !userHasReviewed);
          }
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error: any) {
        console.error("Error in fetching Reviews:", error.message || error);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    },
    [hasMore, isFetching, orderId, productId, userId]
  );

  useEffect(() => {
    const loadInitialReviews = async () => {
      setIsLoading(true);
      await fetchReviews(1); // Fetch the first page
      setIsLoading(false);
    };

    loadInitialReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const throttledFetchReviews = throttle(fetchReviews, 2000);
    return () => throttledFetchReviews.cancel();
  }, [fetchReviews]);

  // If user scrolls too quickly
  const handleScroll = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching]);

  const throttledHandleScroll = throttle(handleScroll, 200);

  const lastReviewRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || !hasMore || isFetching) return; // Prevent observing if already fetching
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          throttledHandleScroll();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching, isLoading, throttledHandleScroll]
  );

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId || !canLeaveReview) {
      setError(
        "You are not eligible to leave another review for this product. Or You must have orderId to leave a review."
      );
      return;
    }

    const url = `/api/reviews/${productId}`;
    const method = "POST";

    const body = JSON.stringify({
      comment: debouncedReviewTextPost,
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
        setPage(1);
        await fetchReviews(1);
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
      comment: debouncedReviewTextEdit,
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

      console.log("Fetch response:", res);
      if (res.ok) {
        setEditMode(false);
        setEditingReviewId(null);
        setReviewTextEdit("");
        setRatingEdit(0);
        setPage(1);
        reviewsRef.current = [];
        await fetchReviews(1);
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
        // Remove the deleted review from reviewsRef and setReviews state
        reviewsRef.current = reviewsRef.current.filter(
          (review) => review._id !== reviewId
        );
        setReviews(reviewsRef.current);
        setEditMode(false);
        setEditingReviewId(null);
        setReviewTextEdit("");
        setRatingEdit(0);

        setPage(1);
        await fetchReviews(1);
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
    const reviewToEdit = reviewsRef.current.find(
      (review) => review._id === reviewId
    );
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
          reviews.map((review: ReviewType, index) =>
            review.customer.clerkId !== userId ? (
              // Show all other users' reviews
              <div
                key={review._id}
                className="border p-4 rounded-xl"
                ref={index === reviews.length - 1 ? lastReviewRef : null}
              >
                <div className="flex flex-row items-center gap-4">
                  <img
                    // use any default image if not logged in
                    src={userProfileImage || "/circle.png"}
                    alt={userName || "User"}
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1">
                    <h4>{review.customer.name || userName}</h4>
                    <StarRating initialRating={review.rating} readonly={true} />
                  </div>
                </div>
                <p className="mt-4">{review.comment}</p>
              </div>
            ) : (
              // Show the user's own review with edit and delete options
              <div
                key={review._id}
                className="border p-4 rounded-xl"
                ref={index === reviews.length - 1 ? lastReviewRef : null}
              >
                <div className="flex flex-row items-center gap-4">
                  <img
                    // use any default image if not logged in
                    src={userProfileImage || "/circle.png"}
                    alt="user icon"
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
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
