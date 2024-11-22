/* eslint-disable @typescript-eslint/no-explicit-any */
import ReviewEligibility from "@/lib/checkReviewEligibility";
import Customer from "@/lib/models/Customer";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { ConnectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// for creating review
export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json("unauthorized", { status: 401 });
  }

  await ConnectDB();
  try {
    const reqBody = await req.json();
    const { orderId, comment, rating } = reqBody;

    if (!orderId) {
      return NextResponse.json("orderId is missing", { status: 400 });
    }

    const isEligible = await ReviewEligibility(params.productId);
    if (!isEligible) {
      return NextResponse.json("Not eligible to review this Product", {
        status: 403,
      });
    }

    const customer = await Customer.findOne({ clerkId: userId });
    if (!customer) {
      return NextResponse.json("Customer Not found", { status: 404 });
    }

    // Check for an existing review by the same customer for the same product
    const existingReview = await Review.findOne({
      customer: customer._id,
      product: params.productId,
    });

    if (existingReview) {
      return NextResponse.json("You have already reviewed this product", {
        status: 409,
      });
    }

    const review = await Review.create({
      customer: customer._id,
      product: params.productId,
      order: orderId,
      rating,
      comment,
    });

    // Update Customer and Product models
    customer.review.push(review._id);
    await customer.save();

    await Product.findByIdAndUpdate(params.productId, {
      $push: { review: review._id },
      $inc: { totalRating: rating, numberOfReviews: 1 },
    });

    //   calculate average rating
    const product = await Product.findById(params.productId);
    product.averageRating = product.totalRating / product.numberOfReviews;
    await product.save();

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("[Review_API]", error);
    return NextResponse.json("Error at posting Review", {
      status: 500,
    });
  }
};

// for getting reviews for a product
export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    await ConnectDB();

    // Get query parameters for pagination (page and limit)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // base 10 2nd arg
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: params.productId })
      .populate({
        path: "customer",
        model: Customer,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      product: params.productId,
    });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json("No reviews found for associated productId", {
        status: 404,
      });
    }

    const responseData = {
      reviews,
      totalReviews,
      page, // current page
      totalPages: Math.ceil(totalReviews / limit),
    };

    const res = NextResponse.json(responseData, { status: 200 });
    return res;
  } catch (error) {
    console.error("[Review_GET_API]", error);
    return NextResponse.json("Error  at getting  Review", {
      status: 500,
    });
  }
};

// for updating reviews for a product
export const PATCH = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json("unauthorized", { status: 401 });
    }

    await ConnectDB();

    const reqBody = await req.json();
    const { reviewId, comment, rating } = reqBody;

    const customer = await Customer.findOne({ clerkId: userId });
    if (!customer) {
      return NextResponse.json("Only paid customers update a review", {
        status: 403,
      });
    }

    //   Ensure the review belongs to the customer making the request
    const review = await Review.findOne({
      _id: reviewId,
      customer: customer._id,
      product: params.productId,
    });
    if (!review) {
      return NextResponse.json("Review not found or not authorized", {
        status: 404,
      });
    }

    // Store old rating to update product ratings
    const oldRating = review.rating;
    review.comment = comment;
    review.rating = rating;
    await review.save();

    // Update product ratings
    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    product.totalRating = product.totalRating - oldRating + rating;
    product.averageRating = product.totalRating / product.numberOfReviews;
    await product.save();

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("[Review_PATCH_API]", error);
    return NextResponse.json("Error at updating Review", { status: 500 });
  }
};

// for deleting reviews for a product
export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    await ConnectDB();
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json("Review ID is missing", { status: 400 });
    }

    // find the customer
    const customer = await Customer.findOne({ clerkId: userId });
    if (!customer) {
      return NextResponse.json("Customer Not Found", { status: 404 });
    }

    // Only related to customer reviews
    const review = await Review.findOne({
      _id: reviewId,
      customer: customer._id,
      product: params.productId,
    });

    if (!review) {
      return NextResponse.json("Review not Found or Not authorized", {
        status: 404,
      });
    }

    // Update product ratings
    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json("Product Not Found", { status: 404 });
    }
    product.totalRating -= review.rating;
    product.numberOfReviews -= 1;
    product.averageRating =
      product.numberOfReviews > 0
        ? product.totalRating / product.numberOfReviews
        : 0;
    await product.save();

    // update customer reviews
    customer.review = customer.review.filter(
      (r: { toString: () => any }) => r.toString() !== reviewId
    );
    await customer.save();

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json("Review deleted Successfully", { status: 200 });
  } catch (error) {
    console.error("[review_Delete_API]", error);
    return NextResponse.json("Error in Deleting Review", { status: 500 });
  }
};
