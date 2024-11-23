import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let secure_url = searchParams.get("secure_url");

  if (!secure_url) {
    return new NextResponse("Missing secure_url", { status: 400 });
  }

  secure_url = decodeURIComponent(secure_url);
  const cloudinaryUrlMatch = secure_url.match(
    /https:\/\/res\.cloudinary\.com\/.+/
  );
  if (!cloudinaryUrlMatch) {
    console.error("Invalid Cloudinary URL format:", secure_url);
    return new NextResponse("Invalid Cloudinary URL format", { status: 400 });
  }

  secure_url = cloudinaryUrlMatch[0];
  try {
    const imageResponse = await fetch(secure_url);
    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch image from Cloudinary", {
        status: 500,
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type":
          imageResponse.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error in Cloudinary cache route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
