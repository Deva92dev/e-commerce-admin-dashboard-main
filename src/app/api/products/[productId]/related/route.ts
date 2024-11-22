import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { productId: string };
  }
) => {
  try {
    ConnectDB();

    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json("No Product Found", { status: 404 });
    }

    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections } },
      ],
      _id: { $ne: product._id }, // Excludes current product from relatedProducts
    });

    if (!relatedProducts) {
      return NextResponse.json("No Related Product Found", { status: 404 });
    }

    return NextResponse.json(relatedProducts, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=1296000, stale-while-revalidate=3600", // 15 days
      },
    });
  } catch (error) {
    console.error("[Related_Products_GET_API]", error);
    return NextResponse.json("Error at fetching related Orders", {
      status: 500,
    });
  }
};
