import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const secureUrl = req.nextUrl.searchParams.get("secure_url");

    if (!secureUrl) {
      return new NextResponse("Missing 'secure_url' parameter", {
        status: 400,
      });
    }

    const decodedUrl = secureUrl.includes("%")
      ? decodeURIComponent(secureUrl)
      : secureUrl;

    if (!decodedUrl.startsWith("https://res.cloudinary.com")) {
      return new NextResponse("Invalid 'secure_url' format", { status: 400 });
    }

    const imageResponse = await fetch(decodedUrl);
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
