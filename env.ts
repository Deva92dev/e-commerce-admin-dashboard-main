import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGO_URI: z.string(),
    CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
    ADMIN_USER_ID: z.string().min(1, "Clerk Admin Id is required"),
    RAZORPAY_WEBHOOK_SECRET: z
      .string()
      .min(1, "razorPay Webhook secret is required"),
    RAZORPAY_KEY_ID: z.string().min(1, "RazorPay Key id is required"),
    RAZORPAY_KEY_SECRET: z.string().min(1, "RazorPat Key secret is required"),
    CLOUDINARY_API_SECRET: z.string().min(1, "API secret is required"),
    NODE_ENV: z.string(),
    CLOUDINARY_API_KEY: z.string().min(1, "API Key is required"),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
      .string()
      .min(1, "Cloud Name is required"),
    NEXT_PUBLIC_RAZORPAY_KEY_ID: z
      .string()
      .min(1, "Razorpay Key ID is required"),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z
      .string()
      .min(1, "Upload Preset is required"),
  },
  runtimeEnv: {
    MONGO_URI: process.env.MONGO_URI,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    ADMIN_USER_ID: process.env.ADMIN_USER_ID,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },
});
