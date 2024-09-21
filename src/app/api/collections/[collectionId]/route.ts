import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { ConnectDB } from "@/lib/mongoDB";
import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { collectionId: string };
  }
) => {
  try {
    await ConnectDB();

    const collection = await Collection.findById(params.collectionId).populate({
      path: "products",
      model: Product,
    });
    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("CollectionId_GET", error);
    return new NextResponse("Internal server error");
  }
};

// for updating
export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: { collectionId: string };
  }
) => {
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
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();
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

export const dynamic = "force-dynamic";
