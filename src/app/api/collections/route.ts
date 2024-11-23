/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collections";
import { ConnectDB } from "@/lib/mongoDB";

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await ConnectDB();
    const { title, description, image } = await request.json();

    // because title is unique, defined in schema
    const existingCollection = await Collection.findOne({ title });
    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 401 });
    }

    if (!title || !image) {
      return new NextResponse("Please provide Title and Image", {
        status: 401,
      });
    }

    const newCollection = await Collection.create({
      title,
      image,
      description,
      userId,
    });

    await newCollection.save();

    return NextResponse.json(newCollection, { status: 200 });
  } catch (error) {
    // this is how you structure your errors
    console.log(["Collection_POST"], error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  try {
    await ConnectDB();

    const collections = await Collection.find({})
      .select("title image products")
      .sort({ createdAt: "desc" });
    // console.log(collections);

    return NextResponse.json(collections, {
      status: 200,
    });
  } catch (error) {
    console.log(["Collection_GET"], error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
