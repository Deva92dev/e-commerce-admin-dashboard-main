/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "@/lib/models/Product";
import User from "@/lib/models/Users";
import { ConnectDB } from "@/lib/mongoDB";
import { ProductType, UserType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json("user is not authenticated", { status: 401 });
    }
    await ConnectDB();

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json("ProductId is Required", { status: 400 });
    }

    const isLiked = user.wishlist.includes(productId);
    if (isLiked) {
      // dislike
      user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    } else {
      // like
      user.wishlist.push(productId);
    }

    await user.save();
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.log("[Wishlist_POST]", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    await ConnectDB();
    const user: UserType = await User.findOne({ clerkId: userId }).populate(
      "wishlist"
    );
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    // Assuming `wishlist` is an array of product IDs
    const wishlistProducts: ProductType[] = await Product.find(
      {
        _id: { $in: user.wishlist },
      },
      "title media price category"
    );

    return NextResponse.json(wishlistProducts, { status: 200 });
  } catch (error) {
    console.log("[Wishlist_GET]", error);
    return NextResponse.json("Error fetching wishlist", { status: 500 });
  }
};
