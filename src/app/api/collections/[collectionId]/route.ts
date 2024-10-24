import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  props: {
    params: Promise<{ collectionId: string }>;
  }
) => {
  const params = await props.params;
  try {
    await ConnectDB();

    const collection = await Collection.findById(params.collectionId)
      .select("title, description, image")
      .populate({
        path: "products",
        model: Product,
        select: "media title category price",
      });
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=1296000, stale-while-revalidate=3600", // 15 days
      },
    });
  } catch (error) {
    console.log("CollectionId_GET", error);
    return new NextResponse("Internal server error");
  }
};

// for updating
export const POST = async (
  req: NextRequest,
  props: {
    params: Promise<{ collectionId: string }>;
  }
) => {
  const params = await props.params;
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await ConnectDB();

    let collection = await Collection.findById(params.collectionId);
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    const { title, image, description } = await req.json();
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 404 });
    }

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, image, description },
      { new: true }
    );

    await collection.save();

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("[Collection_POST_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  props: { params: Promise<{ collectionId: string }> }
) => {
  const params = await props.params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await ConnectDB();
    await Collection.findByIdAndDelete(params.collectionId);

    // update the product after deleting the collection, aggregation pipeline
    await Product.updateMany(
      { collections: params.collectionId },
      {
        $pull: { collections: params.collectionId },
      }
    );

    return new NextResponse("Collection is deleted", { status: 200 });
  } catch (error) {
    console.log("CollectionId_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
