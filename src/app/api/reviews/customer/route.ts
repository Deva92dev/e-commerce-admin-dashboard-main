import Customer from "@/lib/models/Customer";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// getting reviews for a specific customer
export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const customer = await Customer.findOne({ clerkId: userId });
    if (!customer) {
      return NextResponse.json("Customer not Found", { status: 404 });
    }

    const reviews = await Review.find({ customer: customer._id })
      .populate({
        path: "products",
        model: Product,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("[Customer_Review_API]", error);
    return NextResponse.json("Error at getting a specific Customer Review", {
      status: 500,
    });
  }
};
