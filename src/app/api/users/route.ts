/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import User from "@/lib/models/Users";
import { ConnectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    const user = await User.findOne({ clerkId: userId });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Detailed error in [Users_GET]:", error);
    return NextResponse.json("Error at Wishlist", { status: 500 });
  }
};
