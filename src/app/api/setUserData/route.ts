import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userData = await req.json();

  const { userId, userName, userProfileImage } = userData;

  const cookie = await cookies();

  cookie.set(
    "userData",
    JSON.stringify({ userId, userName, userProfileImage }),
    {
      httpOnly: false,
      secure: true,
      maxAge: 30 * 60 * 60 * 24,
    }
  );

  console.log("user data received:", { userId, userName, userProfileImage });

  return NextResponse.json({
    message: "User data stored in cookies successfully",
  });
}
