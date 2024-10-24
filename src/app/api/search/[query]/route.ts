import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, props: { params: Promise<{ query: string }> }) => {
  const params = await props.params;
  try {
    await ConnectDB();

    const searchedProducts = await Product.find({
      $or: [
        // $options- "i" for case in-sensitive, $in used for matching array of values
        { title: { $regex: params.query, $options: "i" } },
        { category: { $regex: params.query, $options: "i" } },
        { tags: { $in: [new RegExp(params.query, "i")] } },
      ],
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (error) {
    console.error("[Search_Query_API]", error);
    return NextResponse.json(
      { error: "Error at SearchQuery" },
      { status: 500 }
    );
  }
};
