"use server";

import { ProductType } from "../types";

// change for production
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";

export const getProductDetails = async (productId: string) => {
  try {
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "GET",
    });
    const product: ProductType = await res.json();
    return product;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    throw error;
  }
};
