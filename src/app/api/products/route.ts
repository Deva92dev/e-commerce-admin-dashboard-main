/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";
import { ConnectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// for creating the product
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await ConnectDB();

    const {
      title,
      description,
      media,
      tags,
      collections,
      sizes,
      color,
      price,
      category,
    } = await req.json();

    if (
      !title ||
      !media ||
      !description ||
      !tags ||
      !sizes ||
      !color ||
      !price ||
      !collections ||
      !category
    ) {
      return new NextResponse(
        "Please provide necessary details about product",
        { status: 400 }
      );
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return new NextResponse("Product already exists", { status: 401 });
    }

    const newProduct = await Product.create({
      title,
      media,
      description,
      tags,
      category,
      collections,
      sizes,
      color,
      price,
      userId,
    });

    await newProduct.save();

    // update the collection related to products
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error: any) {
    console.log("[Product_API]", error);
    return new NextResponse(`Error creating product: ${error.message}`, {
      status: 500,
    });
  }
};

// get all products
export const GET = async (req: NextRequest) => {
  try {
    await ConnectDB();

    const products = await Product.find({})
      .select("title category price media tags createdAt color sizes")
      .sort({
        createdAt: "desc",
      })
      .populate({ path: "collections", model: Collection });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.log(["Product_GET"], error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
