import { v2 as cloudinary } from "cloudinary";
import { env } from "../../../../env";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  console.log("Cloudinary API Key:", env.CLOUDINARY_API_KEY);
  console.log("Cloudinary API Secret:", env.CLOUDINARY_API_SECRET);
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET
  );

  return Response.json({ signature });
}
