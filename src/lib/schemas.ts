import { z } from "zod";

export const CollectionSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().url(),
  products: z.array(z.string()),
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  updatedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
});

export const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  sizes: z.array(z.string()),
  color: z.array(z.string()),
  price: z.number(), // Assuming price is a number
  category: z.string(),
  media: z.array(z.string().url()), // Ensure this is an array of URLs
  tags: z.array(z.string()),
  collections: z.array(CollectionSchema), // Using the Collection schema here
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  updatedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

  numberOfReviews: z.number(),
  totalRating: z.number(),
  averageRating: z.number(),
  review: z.array(z.string()), // Assuming review IDs are strings
});

// For multiple products
export const ProductsSchema = z.array(ProductSchema);
