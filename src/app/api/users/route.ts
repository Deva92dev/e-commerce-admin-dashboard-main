import User from "@/lib/models/Users";
import { ConnectDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({ clerkId: userId });
      await user.save();
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Detailed error in [Users_GET]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};
